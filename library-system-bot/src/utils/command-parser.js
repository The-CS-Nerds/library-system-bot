/**
 * Parse a check command from comment text
 * @param {string} text - The comment text
 * @returns {Object|null} Parsed command or null
 */
export function parseCheckCommand(text) {
  // Check for help command
  if (/(?:@library-system-bot\s+)?help/i.test(text)) {
    return { type: 'help' };
  }

  // Check for check command
  const checkRegex = /check\s+--branch=([^\s]+)(?:\s+--command=(.+?)(?=\s+--|$))?/i;
  const match = text.match(checkRegex);
  
  if (match) {
    return {
      type: 'check',
      branch: match[1].trim(),
      command: match[2]?.trim() || 'docker-compose -f docker-compose.yml build'
    };
  }

  return null;
}
