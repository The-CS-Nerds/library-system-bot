/**
 * Display a fun banner when the bot starts
 * @param {import('probot').Logger} logger
 */
export function displayBanner(logger) {
  const banner = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     LIBRARY SYSTEM BOT                                        ║
║                                                               ║
║   Your friendly neighborhood automation assistant             ║
║   for managing library-system-v3 project workflow             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

  logger.info(banner);
}

/**
 * Get version and runtime information
 * @returns {Object} Version info
 */
export function getVersionInfo() {
  return {
    botVersion: process.env.npm_package_version || 'dev',
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    probotVersion: getProbotVersion()
  };
}

/**
 * Get Probot version from package.json
 * @returns {string}
 */
function getProbotVersion() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.dependencies?.probot || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Display startup information
 * @param {import('probot').Logger} logger
 * @param {Object} config
 */
export function displayStartupInfo(logger, config) {
  const info = getVersionInfo();
  
  logger.info('═══════════════════════════════════════════════════════');
  logger.info('STARTUP INFORMATION');
  logger.info('═══════════════════════════════════════════════════════');
  logger.info(`Bot Version:      ${info.botVersion}`);
  logger.info(`Probot Version:   ${info.probotVersion}`);
  logger.info(`Node Version:     ${info.nodeVersion}`);
  logger.info(`Platform:         ${info.platform} (${info.arch})`);
  logger.info('───────────────────────────────────────────────────────');
  logger.info(`Project ID:       ${config.projectId ? 'configured' : 'missing'}`);
  logger.info(`Priority Field:   ${config.priorityFieldId ? 'configured' : 'missing'}`);
  logger.info(`Status Field:     ${config.statusFieldId ? 'configured' : 'optional'}`);
  logger.info('───────────────────────────────────────────────────────');
  logger.info('Built with assistance from Claude (Anthropic AI)');
  logger.info('═══════════════════════════════════════════════════════');
}

/**
 * Display shutdown message
 * @param {import('probot').Logger} logger
 */
export function displayShutdownMessage(logger) {
  logger.info('');
  logger.info('Library System Bot is shutting down...');
  logger.info('Thanks for using the bot!');
  logger.info('');
}
