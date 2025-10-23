/**
 * Enhanced logger with emoji support and structured formatting
 * Wraps Probot's logger with additional functionality
 */

const EMOJI = {
  // Events
  issue: '📝',
  pr: '🔀',
  comment: '💬',
  label: '🏷️',
  
  // Actions
  add: '➕',
  update: '✏️',
  delete: '🗑️',
  check: '🔍',
  build: '🔨',
  test: '🧪',
  deploy: '🚀',
  
  // Status
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  debug: '🐛',
  
  // Priority
  p0: '🔴',
  p1: '🟠',
  p2: '🟡',
  p3: '🟢',
  
  // Other
  bot: '🤖',
  user: '👤',
  team: '👥',
  config: '⚙️',
  project: '📊',
  rocket: '🚀',
  sparkles: '✨',
  tada: '🎉',
  thinking: '🤔',
  eyes: '👀'
};

/**
 * Create an enhanced logger
 * @param {import('probot').Logger} baseLogger
 * @returns {Object} Enhanced logger
 */
export function createLogger(baseLogger) {
  return {
    // Standard log levels
    info: (msg, ...args) => baseLogger.info(msg, ...args),
    warn: (msg, ...args) => baseLogger.warn(msg, ...args),
    error: (msg, ...args) => baseLogger.error(msg, ...args),
    debug: (msg, ...args) => baseLogger.debug(msg, ...args),
    
    // Enhanced methods
    success: (msg, ...args) => baseLogger.info(`${EMOJI.success} ${msg}`, ...args),
    failure: (msg, ...args) => baseLogger.error(`${EMOJI.error} ${msg}`, ...args),
    
    // Event-specific loggers
    issueOpened: (number, title) => 
      baseLogger.info(`${EMOJI.issue} New issue #${number}: "${title}"`),
    
    prOpened: (number, title) => 
      baseLogger.info(`${EMOJI.pr} New PR #${number}: "${title}"`),
    
    labeled: (number, label) => 
      baseLogger.info(`${EMOJI.label} #${number} labeled: ${label}`),
    
    commentCreated: (number, author) => 
      baseLogger.info(`${EMOJI.comment} Comment on #${number} by @${author}`),
    
    // Action loggers
    projectAdded: (number) => 
      baseLogger.info(`${EMOJI.success} Added #${number} to project board`),
    
    prioritySet: (number, priority) => {
      const emoji = EMOJI[priority] || EMOJI.label;
      baseLogger.info(`${emoji} Set priority ${priority} for #${number}`);
    },
    
    triagePosted: (number) => 
      baseLogger.info(`${EMOJI.success} Posted triage template for #${number}`),
    
    commandReceived: (type, params) => 
      baseLogger.info(`${EMOJI.bot} Command received: ${type}`, params),
    
    // Utility
    emoji: EMOJI,
    
    // Access to original logger
    raw: baseLogger
  };
}

/**
 * Format a log message with metadata
 * @param {string} message
 * @param {Object} metadata
 * @returns {string}
 */
export function formatLogMessage(message, metadata = {}) {
  const parts = [message];
  
  if (metadata.repo) {
    parts.push(`[${metadata.repo}]`);
  }
  
  if (metadata.number) {
    parts.push(`#${metadata.number}`);
  }
  
  if (metadata.user) {
    parts.push(`@${metadata.user}`);
  }
  
  return parts.join(' ');
}
