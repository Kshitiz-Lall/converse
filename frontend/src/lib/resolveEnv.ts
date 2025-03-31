export function resolveEnvVariables(template: string, envVars: Record<string, string> = {}) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => envVars[key.trim()] ?? '');
}
