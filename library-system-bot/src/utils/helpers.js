/**
 * Pick a priority label from the payload
 * @param {Object} payload - The webhook payload
 * @returns {string|null} Priority label (p0-p3) or null
 */
export function pickPriorityLabel(payload) {
  // Check if the label event itself is a priority label
  const direct = payload.label?.name?.toLowerCase();
  if (direct && /^p[0-3]$/.test(direct)) {
    return direct;
  }

  // Check all labels on the issue/PR
  const labels = (payload.issue?.labels || payload.pull_request?.labels || [])
    .map((l) => (typeof l === 'string' ? l : l.name?.toLowerCase()))
    .filter(Boolean);

  return labels.find((n) => /^p[0-3]$/.test(n)) || null;
}

/**
 * Get the node ID of the issue or PR
 * @param {Object} payload - The webhook payload
 * @returns {string|null} Node ID or null
 */
export function getContentNodeId(payload) {
  return payload.issue?.node_id || payload.pull_request?.node_id || null;
}

/**
 * Check if labels include a specific label
 * @param {Array} labels - Array of labels
 * @param {string} labelName - Label to check for
 * @returns {boolean}
 */
export function hasLabel(labels, labelName) {
  return labels.some((l) => {
    const name = typeof l === 'string' ? l : l.name;
    return name === labelName;
  });
}

/**
 * Format a timestamp to a readable string
 * @param {Date} date
 * @returns {string}
 */
export function formatTimestamp(date = new Date()) {
  return date.toISOString().replace('T', ' ').substring(0, 19);
}
