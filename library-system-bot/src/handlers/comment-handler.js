import { parseCheckCommand } from '../utils/command-parser.js';
import { executeCheckCommand } from '../utils/check-runner.js';

const BOT_MENTION = '@library-system-bot';

/**
 * Handles when a comment is created on an issue or PR
 * @param {import('probot').Context} context
 */
export async function handleIssueComment(context) {
  const { comment, issue } = context.payload;
  
  // Ignore comments from bots to prevent loops
  if (comment.user.type === 'Bot') {
    return;
  }

  const commentBody = comment.body || '';
  
  // Check if bot is mentioned
  if (!commentBody.includes(BOT_MENTION)) {
    return;
  }

  context.log.info(`Bot mentioned in comment on issue/PR #${issue.number}`);

  try {
    // Parse for commands
    const command = parseCheckCommand(commentBody);
    
    if (command) {
      context.log.info(`Command detected: ${command.type}`, command);
      
      switch (command.type) {
        case 'check':
          await executeCheckCommand(context, command);
          break;
        
        case 'help':
          await showHelp(context);
          break;
          
        default:
          await showUnknownCommand(context, command.type);
      }
    } else {
      // Bot was mentioned but no valid command found
      await showHelp(context);
    }
  } catch (error) {
    context.log.error(`Error handling comment: ${error.message}`, error);
    await postErrorMessage(context, error);
  }
}

/**
 * Shows help message
 * @param {import('probot').Context} context
 */
async function showHelp(context) {
  const helpMessage = `Hello! I'm the Library System Bot. Here's what I can do:

### Check Command
Run checks on a specific branch:
\`\`\`
${BOT_MENTION} check --branch=<branch-name> [--command=<command>]
\`\`\`

**Examples:**
- \`${BOT_MENTION} check --branch=main\`
- \`${BOT_MENTION} check --branch=feature/auth --command=npm run test\`
- \`${BOT_MENTION} check --branch=develop --command=npm run build\`

**Default command:** \`docker-compose -f docker-compose.yml build\`

---

### What I Do Automatically
- Add issues & PRs to the project board
- Set priorities based on labels (p0, p1, p2, p3)
- Post triage templates for issues with "Triage Needed" label

---

Need more help? Check the [documentation](https://github.com/The-CS-Nerds/library-system-bot/blob/main/README.md)!

<sub>Built with assistance from Claude 4.5 Sonnet (Anthropic AI)</sub>`;

  await context.octokit.issues.createComment(
    context.issue({ body: helpMessage })
  );
  
  context.log.info('Posted help message');
}

/**
 * Shows unknown command message
 * @param {import('probot').Context} context
 * @param {string} commandType
 */
async function showUnknownCommand(context, commandType) {
  const message = `Unknown command: \`${commandType}\`

Type \`${BOT_MENTION} help\` to see available commands.`;

  await context.octokit.issues.createComment(
    context.issue({ body: message })
  );
}

/**
 * Posts error message to the issue
 * @param {import('probot').Context} context
 * @param {Error} error
 */
async function postErrorMessage(context, error) {
  const message = `**Error:** Something went wrong while processing your request.

**Details:** ${error.message}

Please try again or contact the maintainers if this persists.`;

  try {
    await context.octokit.issues.createComment(
      context.issue({ body: message })
    );
  } catch (err) {
    context.log.error(`Failed to post error message: ${err.message}`);
  }
}
