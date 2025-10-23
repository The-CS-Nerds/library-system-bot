let config = null;

/**
 * Initialize and cache configuration
 */
export function initConfig() {
  if (config) return config;

  config = {
    projectId: process.env.PROJECT_ID,
    priorityFieldId: process.env.PRIORITY_FIELD_ID,
    statusFieldId: process.env.STATUS_FIELD_ID,
    
    optionMap: {
      p0: process.env.p0,
      p1: process.env.p1,
      p2: process.env.p2,
      p3: process.env.p3
    },
    
    statusMap: {
      'Not Started': process.env.Not_Started,
      'In Progress': process.env.In_Progress,
      'Done': process.env.Done,
      "Won't Fix": process.env.Wont_Fix
    }
  };

  return config;
}

/**
 * Get the current configuration
 */
export function getConfig() {
  if (!config) {
    return initConfig();
  }
  return config;
}

/**
 * Check if configuration is valid
 */
export function isConfigValid() {
  const cfg = getConfig();
  return !!(cfg.projectId && cfg.priorityFieldId);
}
