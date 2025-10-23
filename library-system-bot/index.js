import { initConfig, isConfigValid, getConfig } from './src/utils/config.js';
import { handleIssueOpened, handleIssueLabeled, handleIssueEdited } from './src/handlers/issue-handler.js';
import { handlePullRequestOpened, handlePullRequestLabeled, handlePullRequestEdited } from './src/handlers/pull-request-handler.js';
import { handleIssueComment } from './src/handlers/comment-handler.js';
import { displayBanner, displayStartupInfo } from './src/utils/banner.js';

/**
 * Library System Bot - Main Entry Point
 * 
 * A GitHub App that automates project management for library-system-v3
 * 
 * Features:
 * - Automatically adds issues/PRs to GitHub Projects
 * - Sets priority based on labels
 * - Posts triage templates
 * - Responds to bot mentions with commands
 * 
 * @param {import('probot').Probot} app
 */
export default (app) => {
  // Initialize configuration
  const config = initConfig();
  
  // Display fancy startup banner
  displayBanner(app.log);
  displayStartupInfo(app.log, config);
  
  // Validate configuration
  if (!isConfigValid()) {
    app.log.warn('');
    app.log.warn('═══════════════════════════════════════════════════════════');
    app.log.warn('WARNING: Bot is not fully configured!');
    app.log.warn('═══════════════════════════════════════════════════════════');
    app.log.warn('Please set PROJECT_ID and PRIORITY_FIELD_ID in .env');
    app.log.warn('The bot will start but project management features will be limited');
    app.log.warn('See README.md for configuration instructions');
    app.log.warn('');
  } else {
    app.log.info('All required configuration validated successfully!');
    app.log.info('');
  }

  // ============================================
  // ISSUE HANDLERS
  // ============================================
  
  app.on('issues.opened', async (context) => {
    try {
      await handleIssueOpened(context);
    } catch (error) {
      context.log.error('Error in issues.opened handler:', error);
    }
  });

  app.on('issues.labeled', async (context) => {
    try {
      await handleIssueLabeled(context);
    } catch (error) {
      context.log.error('Error in issues.labeled handler:', error);
    }
  });

  app.on('issues.edited', async (context) => {
    try {
      await handleIssueEdited(context);
    } catch (error) {
      context.log.error('Error in issues.edited handler:', error);
    }
  });

  // ============================================
  // PULL REQUEST HANDLERS
  // ============================================

  app.on('pull_request.opened', async (context) => {
    try {
      await handlePullRequestOpened(context);
    } catch (error) {
      context.log.error('Error in pull_request.opened handler:', error);
    }
  });

  app.on('pull_request.labeled', async (context) => {
    try {
      await handlePullRequestLabeled(context);
    } catch (error) {
      context.log.error('Error in pull_request.labeled handler:', error);
    }
  });

  app.on('pull_request.edited', async (context) => {
    try {
      await handlePullRequestEdited(context);
    } catch (error) {
      context.log.error('Error in pull_request.edited handler:', error);
    }
  });

  // ============================================
  // COMMENT HANDLERS (Bot Commands)
  // ============================================

  app.on('issue_comment.created', async (context) => {
    try {
      await handleIssueComment(context);
    } catch (error) {
      context.log.error('Error in issue_comment.created handler:', error);
    }
  });

  // ============================================
  // READY!
  // ============================================

  app.log.info('');
  app.log.info('╔═══════════════════════════════════════════════════════════════╗');
  app.log.info('║  Library System Bot is READY and listening for events       ║');
  app.log.info('╚═══════════════════════════════════════════════════════════════╝');
  app.log.info('');
  app.log.info('Quick Links:');
  app.log.info('  Documentation: https://github.com/The-CS-Nerds/library-system-bot');
  app.log.info('  Report Issues: https://github.com/The-CS-Nerds/library-system-bot/issues');
  app.log.info('  Discussions:   https://github.com/The-CS-Nerds/library-system-bot/discussions');
  app.log.info('');
  app.log.info('Tip: Mention @library-system-bot in any issue/PR comment');
  app.log.info('');
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    app.log.info('');
    app.log.info('Received SIGTERM, shutting down gracefully...');
    app.log.info('Thanks for using Library System Bot!');
    app.log.info('');
    process.exit(0);
  });
};
