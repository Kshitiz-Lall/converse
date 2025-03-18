// backend/src/services/environmentService.ts
import fs from "fs/promises";
import path from "path";

// Define environment file path
const ENVIRONMENTS_FILE = path.join(__dirname, "../../data/environments.json");

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
 * Ensure the environments file and directory exist
 */
const ensureEnvironmentsFile = async (): Promise<void> => {
  try {
    // Ensure directory exists
    const directory = path.dirname(ENVIRONMENTS_FILE);
    await fs.mkdir(directory, { recursive: true });

    // Check if file exists
    try {
      await fs.access(ENVIRONMENTS_FILE);
    } catch (error) {
      // Create empty environments file if it doesn't exist
      await fs.writeFile(
        ENVIRONMENTS_FILE,
        JSON.stringify({
          environments: [],
        })
      );
    }
  } catch (error) {
    console.error("Error ensuring environments file exists:", error);
    throw error;
  }
};

/**
 * Get all environments
 */
export const getEnvironments = async (): Promise<Environment[]> => {
  try {
    await ensureEnvironmentsFile();

    const content = await fs.readFile(ENVIRONMENTS_FILE, "utf-8");
    const data = JSON.parse(content);

    return data.environments || [];
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
    const environments = await getEnvironments();
    return environments.find((env) => env.isActive) || null;
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
    await ensureEnvironmentsFile();

    const content = await fs.readFile(ENVIRONMENTS_FILE, "utf-8");
    const data = JSON.parse(content);

    const environments = data.environments || [];

    // Create a new environment with a unique ID
    const newEnvironment: Environment = {
      id: generateId(),
      name,
      variables,
      isActive: environments.length === 0, // Make active if it's the first environment
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the new environment
    environments.push(newEnvironment);

    // Update the file
    await fs.writeFile(
      ENVIRONMENTS_FILE,
      JSON.stringify({ environments }, null, 2)
    );

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
    await ensureEnvironmentsFile();

    const content = await fs.readFile(ENVIRONMENTS_FILE, "utf-8");
    const data = JSON.parse(content);

    const environments = data.environments || [];

    // Find the environment to update
    const index = environments.findIndex((env: Environment) => env.id === id);

    if (index === -1) {
      return null; // Environment not found
    }

    // Update the environment
    const updatedEnvironment = {
      ...environments[index],
      ...updates,
      updatedAt: new Date(),
    };

    environments[index] = updatedEnvironment;

    // Update the file
    await fs.writeFile(
      ENVIRONMENTS_FILE,
      JSON.stringify({ environments }, null, 2)
    );

    return updatedEnvironment;
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
    await ensureEnvironmentsFile();

    const content = await fs.readFile(ENVIRONMENTS_FILE, "utf-8");
    const data = JSON.parse(content);

    const environments = data.environments || [];

    // Find the environment to delete
    const index = environments.findIndex((env: Environment) => env.id === id);

    if (index === -1) {
      return false; // Environment not found
    }

    // Check if it's the active environment
    const isActive = environments[index].isActive;

    // Remove the environment
    environments.splice(index, 1);

    // If it was active and there are other environments, make the first one active
    if (isActive && environments.length > 0) {
      environments[0].isActive = true;
    }

    // Update the file
    await fs.writeFile(
      ENVIRONMENTS_FILE,
      JSON.stringify({ environments }, null, 2)
    );

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
    await ensureEnvironmentsFile();

    const content = await fs.readFile(ENVIRONMENTS_FILE, "utf-8");
    const data = JSON.parse(content);

    const environments = data.environments || [];

    // Reset active status for all environments
    environments.forEach((env: Environment) => {
      env.isActive = false;
    });

    // Find the environment to make active
    const index = environments.findIndex((env: Environment) => env.id === id);

    if (index === -1) {
      return null; // Environment not found
    }

    // Set the environment as active
    environments[index].isActive = true;

    // Update the file
    await fs.writeFile(
      ENVIRONMENTS_FILE,
      JSON.stringify({ environments }, null, 2)
    );

    return environments[index];
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
    } catch (e) {
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
