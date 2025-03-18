import fs from "fs/promises";
import path from "path";

// Define collections file path
const COLLECTIONS_FILE = path.join(__dirname, "../../data/collections.json");

// Define collection interfaces
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

interface PostmanParam {
  key: string;
  value: string;
}

interface InsomniaParam {
  name: string;
  value: string;
}

/**
 * Ensure the collections file and directory exist
 */
const ensureCollectionsFile = async (): Promise<void> => {
  try {
    // Ensure directory exists
    const directory = path.dirname(COLLECTIONS_FILE);
    await fs.mkdir(directory, { recursive: true });

    // Check if file exists
    try {
      await fs.access(COLLECTIONS_FILE);
    } catch (error) {
      // Create empty collections file if it doesn't exist
      await fs.writeFile(
        COLLECTIONS_FILE,
        JSON.stringify({
          collections: [],
        })
      );
    }
  } catch (error) {
    console.error("Error ensuring collections file exists:", error);
    throw error;
  }
};

/**
 * Get all collections
 */
export const getCollections = async (): Promise<Collection[]> => {
  try {
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    return data.collections || [];
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
    const collections = await getCollections();
    return collections.find((collection) => collection.id === id) || null;
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
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    const collections = data.collections || [];

    // Create a new collection with a unique ID
    const newCollection: Collection = {
      id: generateId(),
      name,
      description,
      requests: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the new collection
    collections.push(newCollection);

    // Update the file
    await fs.writeFile(
      COLLECTIONS_FILE,
      JSON.stringify({ collections }, null, 2)
    );

    return newCollection;
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
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    const collections = data.collections || [];

    // Find the collection to update
    const index = collections.findIndex((col: Collection) => col.id === id);

    if (index === -1) {
      return null; // Collection not found
    }

    // Update the collection
    const updatedCollection = {
      ...collections[index],
      ...updates,
      updatedAt: new Date(),
    };

    collections[index] = updatedCollection;

    // Update the file
    await fs.writeFile(
      COLLECTIONS_FILE,
      JSON.stringify({ collections }, null, 2)
    );

    return updatedCollection;
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
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    const collections = data.collections || [];

    // Find the collection to delete
    const index = collections.findIndex((col: Collection) => col.id === id);

    if (index === -1) {
      return false; // Collection not found
    }

    // Remove the collection
    collections.splice(index, 1);

    // Update the file
    await fs.writeFile(
      COLLECTIONS_FILE,
      JSON.stringify({ collections }, null, 2)
    );

    return true;
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
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    const collections = data.collections || [];

    // Find the collection
    const index = collections.findIndex(
      (col: Collection) => col.id === collectionId
    );

    if (index === -1) {
      return null; // Collection not found
    }

    // Create a new request with a unique ID
    const newRequest: RequestItem = {
      id: generateId(),
      ...request,
    };

    // Add the request to the collection
    collections[index].requests.push(newRequest);
    collections[index].updatedAt = new Date();

    // Update the file
    await fs.writeFile(
      COLLECTIONS_FILE,
      JSON.stringify({ collections }, null, 2)
    );

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
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    const collections = data.collections || [];

    // Find the collection
    const colIndex = collections.findIndex(
      (col: Collection) => col.id === collectionId
    );

    if (colIndex === -1) {
      return null; // Collection not found
    }

    // Find the request
    const reqIndex = collections[colIndex].requests.findIndex(
      (req: RequestItem) => req.id === requestId
    );

    if (reqIndex === -1) {
      return null; // Request not found
    }

    // Update the request
    const updatedRequest = {
      ...collections[colIndex].requests[reqIndex],
      ...updates,
    };

    collections[colIndex].requests[reqIndex] = updatedRequest;
    collections[colIndex].updatedAt = new Date();

    // Update the file
    await fs.writeFile(
      COLLECTIONS_FILE,
      JSON.stringify({ collections }, null, 2)
    );

    return updatedRequest;
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
    await ensureCollectionsFile();

    const content = await fs.readFile(COLLECTIONS_FILE, "utf-8");
    const data = JSON.parse(content);

    const collections = data.collections || [];

    // Find the collection
    const colIndex = collections.findIndex(
      (col: Collection) => col.id === collectionId
    );

    if (colIndex === -1) {
      return false; // Collection not found
    }

    // Find the request
    const reqIndex = collections[colIndex].requests.findIndex(
      (req: RequestItem) => req.id === requestId
    );

    if (reqIndex === -1) {
      return false; // Request not found
    }

    // Remove the request
    collections[colIndex].requests.splice(reqIndex, 1);
    collections[colIndex].updatedAt = new Date();

    // Update the file
    await fs.writeFile(
      COLLECTIONS_FILE,
      JSON.stringify({ collections }, null, 2)
    );

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
          if (request.headers && typeof header.key === 'string') {
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
            if (typeof param.key === 'string') {
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
        if (request.headers && typeof header.name === 'string') {
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
          if (typeof param.name === 'string') {
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
            raw: typeof req.body === "string" ? req.body : JSON.stringify(req.body, null, 2),
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
