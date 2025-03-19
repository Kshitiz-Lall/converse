import CollectionModel from "../models/Collection";
import { ICollection, IRequestItem } from "../models/Collection"; // Import the interfaces from your model

// Define plain object interfaces for service layer (without Document properties)
export interface RequestItem {
  id: string;
  name: string;
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  description?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  requests: RequestItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Postman and Insomnia interfaces
interface PostmanHeader {
  key: string;
  value: string;
  type: string;
}

interface PostmanRequest {
  name: string;
  request: {
    method: string;
    header: PostmanHeader[];
    url: string;
    description: string;
    body?: {
      mode: string;
      raw: string;
      options?: {
        raw: {
          language: string;
        };
      };
    };
  };
}

interface InsomniaParam {
  name: string;
  value: string;
}

/**
 * Get all collections
 */
export const getCollections = async (): Promise<Collection[]> => {
  try {
    const collections = await CollectionModel.find({}).lean();
    return collections as unknown as Collection[];
  } catch (error) {
    console.error("Error getting collections:", error);
    throw error;
  }
};

/**
 * Get collection by ID
 */
export const getCollectionById = async (
  id: string
): Promise<Collection | null> => {
  try {
    const collection = await CollectionModel.findOne({ id }).lean();
    return collection as unknown as Collection | null;
  } catch (error) {
    console.error("Error getting collection:", error);
    throw error;
  }
};

/**
 * Create a new collection
 */
export const createCollection = async (
  name: string,
  description?: string
): Promise<Collection> => {
  try {
    // Create a new collection with a unique ID
    const newCollectionData: Collection = {
      id: generateId(),
      name,
      description,
      requests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB - cast to any to bypass TypeScript errors
    const created = await CollectionModel.create(newCollectionData as any);

    // Return as plain object
    return created.toObject() as unknown as Collection;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

/**
 * Update a collection
 */
export const updateCollection = async (
  id: string,
  updates: { name?: string; description?: string }
): Promise<Collection | null> => {
  try {
    const collection = await CollectionModel.findOne({ id });

    if (!collection) {
      return null; // Collection not found
    }

    // Update fields
    if (updates.name) collection.name = updates.name;
    if (updates.description !== undefined)
      collection.description = updates.description;
    collection.updatedAt = new Date();

    // Save changes
    await collection.save();

    return collection.toObject() as unknown as Collection;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

/**
 * Delete a collection
 */
export const deleteCollection = async (id: string): Promise<boolean> => {
  try {
    const result = await CollectionModel.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

/**
 * Add request to collection
 */
export const addRequestToCollection = async (
  collectionId: string,
  request: Omit<RequestItem, "id">
): Promise<RequestItem | null> => {
  try {
    const collection = await CollectionModel.findOne({ id: collectionId });

    if (!collection) {
      return null; // Collection not found
    }

    // Create a new request with a unique ID
    const newRequest: RequestItem = {
      id: generateId(),
      ...request,
    };

    // Add to collection - convert to IRequestItem format that Mongoose expects
    collection.requests.push(newRequest as unknown as IRequestItem);
    collection.updatedAt = new Date();
    await collection.save();

    return newRequest;
  } catch (error) {
    console.error("Error adding request to collection:", error);
    throw error;
  }
};

/**
 * Update request in collection
 */
export const updateRequestInCollection = async (
  collectionId: string,
  requestId: string,
  updates: Partial<Omit<RequestItem, "id">>
): Promise<RequestItem | null> => {
  try {
    const collection = await CollectionModel.findOne({ id: collectionId });

    if (!collection) {
      return null; // Collection not found
    }

    // Find the request index
    const reqIndex = collection.requests.findIndex(
      (req) => req.id === requestId
    );

    if (reqIndex === -1) {
      return null; // Request not found
    }

    // Get the existing request
    const existingRequest = collection.requests[reqIndex];

    // Create updated request by merging existing with updates
    const updatedRequest = {
      ...existingRequest.toObject(),
      ...updates,
    };

    // Update request in collection
    collection.requests[reqIndex] = updatedRequest as unknown as IRequestItem;
    collection.updatedAt = new Date();
    await collection.save();

    return updatedRequest as RequestItem;
  } catch (error) {
    console.error("Error updating request in collection:", error);
    throw error;
  }
};

/**
 * Delete request from collection
 */
export const deleteRequestFromCollection = async (
  collectionId: string,
  requestId: string
): Promise<boolean> => {
  try {
    const collection = await CollectionModel.findOne({ id: collectionId });

    if (!collection) {
      return false; // Collection not found
    }

    // Find the request index
    const reqIndex = collection.requests.findIndex(
      (req) => req.id === requestId
    );

    if (reqIndex === -1) {
      return false; // Request not found
    }

    // Remove the request
    collection.requests.splice(reqIndex, 1);
    collection.updatedAt = new Date();
    await collection.save();

    return true;
  } catch (error) {
    console.error("Error deleting request from collection:", error);
    throw error;
  }
};

/**
 * Import collection from Postman/Insomnia format
 */
export const importCollection = async (
  collectionData: any
): Promise<Collection | null> => {
  try {
    // Handle Postman collection format (v2.1)
    if (
      collectionData.info &&
      collectionData.item &&
      Array.isArray(collectionData.item)
    ) {
      return importPostmanCollection(collectionData);
    }

    // Handle Insomnia collection format
    if (
      collectionData._type === "export" &&
      collectionData.resources &&
      Array.isArray(collectionData.resources)
    ) {
      return importInsomniaCollection(collectionData);
    }

    // Unsupported format
    throw new Error("Unsupported collection format");
  } catch (error) {
    console.error("Error importing collection:", error);
    return null;
  }
};

/**
 * Import Postman collection
 */
const importPostmanCollection = async (
  postmanCollection: any
): Promise<Collection> => {
  // Create a new collection
  const collection = await createCollection(
    postmanCollection.info.name,
    postmanCollection.info.description || "Imported from Postman"
  );

  // Process requests
  for (const item of postmanCollection.item) {
    // Skip folders (for now - could handle nested structure later)
    if (item.item && Array.isArray(item.item)) {
      continue;
    }

    if (item.request) {
      const request: Omit<RequestItem, "id"> = {
        name: item.name,
        url:
          typeof item.request.url === "string"
            ? item.request.url
            : item.request.url.raw,
        method: item.request.method,
        description: item.request.description || "",
        headers: {},
        body: undefined,
        params: {},
      };

      // Process headers
      if (item.request.header && Array.isArray(item.request.header)) {
        for (const header of item.request.header) {
          if (request.headers && typeof header.key === "string") {
            request.headers[header.key] = header.value;
          }
        }
      }

      // Process body
      if (item.request.body) {
        if (item.request.body.mode === "raw" && item.request.body.raw) {
          try {
            request.body = JSON.parse(item.request.body.raw);
          } catch (e) {
            request.body = item.request.body.raw;
          }
        } else if (
          item.request.body.mode === "formdata" &&
          item.request.body.formdata
        ) {
          const formData: Record<string, string> = {};
          for (const param of item.request.body.formdata) {
            if (typeof param.key === "string") {
              formData[param.key] = param.value;
            }
          }
          request.body = formData;
        }
      }

      // Add request to collection
      await addRequestToCollection(collection.id, request);
    }
  }

  return collection;
};

/**
 * Import Insomnia collection
 */
const importInsomniaCollection = async (
  insomniaExport: any
): Promise<Collection> => {
  // Create a new collection
  const collection = await createCollection(
    "Insomnia Import",
    "Imported from Insomnia"
  );

  // Find requests in the export
  const requests = insomniaExport.resources.filter(
    (r: any) => r._type === "request"
  );

  // Process requests
  for (const item of requests) {
    const request: Omit<RequestItem, "id"> = {
      name: item.name,
      url: item.url,
      method: item.method,
      description: item.description || "",
      headers: {},
      body: undefined,
      params: {},
    };

    // Process headers
    if (item.headers && Array.isArray(item.headers)) {
      for (const header of item.headers) {
        if (request.headers && typeof header.name === "string") {
          request.headers[header.name] = header.value;
        }
      }
    }

    // Process body
    if (item.body) {
      if (item.body.text) {
        try {
          request.body = JSON.parse(item.body.text);
        } catch (e) {
          request.body = item.body.text;
        }
      } else if (item.body.params && Array.isArray(item.body.params)) {
        const formData: Record<string, string> = {};
        for (const param of item.body.params) {
          if (typeof param.name === "string") {
            formData[param.name] = param.value;
          }
        }
        request.body = formData;
      }
    }

    // Add request to collection
    await addRequestToCollection(collection.id, request);
  }

  return collection;
};

/**
 * Export collection to Postman format
 */
export const exportCollectionToPostman = async (id: string): Promise<any> => {
  try {
    const collection = await getCollectionById(id);

    if (!collection) {
      throw new Error("Collection not found");
    }

    // Create Postman collection structure
    const postmanCollection = {
      info: {
        _postman_id: collection.id,
        name: collection.name,
        description: collection.description || "",
        schema:
          "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: collection.requests.map((req) => {
        const postmanRequest: PostmanRequest = {
          name: req.name,
          request: {
            method: req.method,
            header: [],
            url: req.url,
            description: req.description || "",
          },
        };

        // Add headers
        if (req.headers) {
          postmanRequest.request.header = Object.entries(req.headers).map(
            ([key, value]) => ({
              key,
              value,
              type: "text",
            })
          );
        }

        // Add body
        if (req.body) {
          postmanRequest.request.body = {
            mode: "raw",
            raw:
              typeof req.body === "string"
                ? req.body
                : JSON.stringify(req.body, null, 2),
          };

          // Add options for JSON content
          if (typeof req.body !== "string") {
            postmanRequest.request.body.options = {
              raw: {
                language: "json",
              },
            };
          }
        }

        return postmanRequest;
      }),
    };

    return postmanCollection;
  } catch (error) {
    console.error("Error exporting collection to Postman format:", error);
    throw error;
  }
};

/**
 * Generate a simple unique ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
};
