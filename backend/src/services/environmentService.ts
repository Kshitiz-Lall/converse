import Environment from "../models/Environment";

// Define environment interfaces
export interface Environment {
  id: string;
  name: string;
  variables: Record<string, string>;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all environments
 */
export const getEnvironments = async (): Promise<Environment[]> => {
  try {
    const environments = await Environment.find({}).lean();
    return environments as Environment[];
  } catch (error) {
    console.error("Error getting environments:", error);
    throw error;
  }
};

/**
 * Get active environment
 */
export const getActiveEnvironment = async (): Promise<Environment | null> => {
  try {
    const activeEnv = await Environment.findOne({ isActive: true }).lean();
    return activeEnv as Environment | null;
  } catch (error) {
    console.error("Error getting active environment:", error);
    throw error;
  }
};

/**
 * Create a new environment
 */
export const createEnvironment = async (
  name: string,
  variables: Record<string, string> = {}
): Promise<Environment> => {
  try {
    // Check if this will be the first environment (to set as active)
    const count = await Environment.countDocuments();
    const isActive = count === 0;

    // Create a new environment with a unique ID
    const newEnvironment: Environment = {
      id: generateId(),
      name,
      variables,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    await Environment.create(newEnvironment);

    return newEnvironment;
  } catch (error) {
    console.error("Error creating environment:", error);
    throw error;
  }
};

/**
 * Update an environment
 */
export const updateEnvironment = async (
  id: string,
  updates: { name?: string; variables?: Record<string, string> }
): Promise<Environment | null> => {
  try {
    const environment = await Environment.findOne({ id });

    if (!environment) {
      return null; // Environment not found
    }

    // Update fields
    if (updates.name) environment.name = updates.name;
    if (updates.variables) environment.variables = updates.variables;
    environment.updatedAt = new Date();

    // Save changes
    await environment.save();

    return environment.toObject() as Environment;
  } catch (error) {
    console.error("Error updating environment:", error);
    throw error;
  }
};

/**
 * Delete an environment
 */
export const deleteEnvironment = async (id: string): Promise<boolean> => {
  try {
    // Get the environment to check if it's active
    const environment = await Environment.findOne({ id });

    if (!environment) {
      return false; // Environment not found
    }

    // Check if it was active
    const wasActive = environment.isActive;

    // Delete the environment
    await Environment.deleteOne({ id });

    // If it was active, make another environment active
    if (wasActive) {
      const remainingEnv = await Environment.findOne();
      if (remainingEnv) {
        remainingEnv.isActive = true;
        await remainingEnv.save();
      }
    }

    return true;
  } catch (error) {
    console.error("Error deleting environment:", error);
    throw error;
  }
};

/**
 * Set active environment
 */
export const setActiveEnvironment = async (
  id: string
): Promise<Environment | null> => {
  try {
    // First, clear active status for all environments
    await Environment.updateMany({}, { isActive: false });

    // Then, set the chosen environment as active
    const environment = await Environment.findOneAndUpdate(
      { id },
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );

    return environment ? (environment.toObject() as Environment) : null;
  } catch (error) {
    console.error("Error setting active environment:", error);
    throw error;
  }
};

/**
 * Process a string and replace environment variables
 * Variables format: {{variableName}}
 */
export const processEnvironmentVariables = async (
  text: string
): Promise<string> => {
  try {
    const activeEnv = await getActiveEnvironment();

    if (!activeEnv) {
      return text; // No active environment, return unchanged
    }

    // Replace variables in the format {{variableName}}
    return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
      const value = activeEnv.variables[variableName];
      return value !== undefined ? value : match; // If variable not found, keep original text
    });
  } catch (error) {
    console.error("Error processing environment variables:", error);
    return text; // In case of error, return unchanged
  }
};

/**
 * Process request data and replace environment variables in all fields
 */
export const processRequestWithEnvironment = async (
  request: any
): Promise<any> => {
  if (!request) return request;

  const activeEnv = await getActiveEnvironment();
  if (!activeEnv) return request; // No active environment, return unchanged

  const processed = { ...request };

  // Process URL
  if (typeof processed.url === "string") {
    processed.url = await processEnvironmentVariables(processed.url);
  }

  // Process headers
  if (processed.headers && typeof processed.headers === "object") {
    const processedHeaders: Record<string, string> = {};

    for (const [key, value] of Object.entries(processed.headers)) {
      if (typeof value === "string") {
        processedHeaders[key] = await processEnvironmentVariables(value);
      } else {
        // Fix: Convert non-string values to string
        processedHeaders[key] = String(value);
      }
    }

    processed.headers = processedHeaders;
  }

  // Process query parameters
  if (processed.params && typeof processed.params === "object") {
    const processedParams: Record<string, string> = {};

    for (const [key, value] of Object.entries(processed.params)) {
      if (typeof value === "string") {
        processedParams[key] = await processEnvironmentVariables(value);
      } else {
        // Fix: Convert non-string values to string
        processedParams[key] = String(value);
      }
    }

    processed.params = processedParams;
  }

  // Process body if it's a string (could be JSON or other text format)
  if (typeof processed.body === "string") {
    processed.body = await processEnvironmentVariables(processed.body);
  } else if (processed.body && typeof processed.body === "object") {
    // If body is an object, convert to JSON string, process, then parse back
    const bodyStr = JSON.stringify(processed.body);
    const processedBodyStr = await processEnvironmentVariables(bodyStr);
    try {
      processed.body = JSON.parse(processedBodyStr);
    } catch {
      // If parsing fails, keep the processed string
      processed.body = processedBodyStr;
    }
  }

  return processed;
};

/**
 * Generate a simple unique ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12);
};
