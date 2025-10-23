import { addToProject, setPriorityOnItem } from '../utils/project.js';
import { pickPriorityLabel, getContentNodeId } from '../utils/helpers.js';

/**
 * Handles when a pull request is opened
 * @param {import('probot').Context} context
 */
export async function handlePullRequestOpened(context) {
  const { pull_request } = context.payload;
  
  context.log.info(`New PR created: #${pull_request.number} - "${pull_request.title}"`);
  
  const contentId = getContentNodeId(context.payload);
  if (!contentId) {
    context.log.warn('Could not get content node ID');
    return;
  }

  try {
    // Add PR to project board
    const itemId = await addToProject(context, contentId);
    if (itemId) {
      context.log.info(`Added PR #${pull_request.number} to project`);
    }

    // Set priority if label exists
    const priorityLabel = pickPriorityLabel(context.payload);
    if (priorityLabel && itemId) {
      await setPriorityOnItem(context, itemId, priorityLabel);
      context.log.info(`Set priority ${priorityLabel} for PR #${pull_request.number}`);
    }
  } catch (error) {
    context.log.error(`Error handling PR creation: ${error.message}`, error);
  }
}

/**
 * Handles when a PR is labeled
 * @param {import('probot').Context} context
 */
export async function handlePullRequestLabeled(context) {
  const { pull_request, label } = context.payload;
  
  context.log.info(`PR #${pull_request.number} labeled with: ${label?.name}`);

  const contentId = getContentNodeId(context.payload);
  if (!contentId) return;

  try {
    const priorityLabel = pickPriorityLabel(context.payload);
    if (priorityLabel) {
      const itemId = await addToProject(context, contentId);
      if (itemId) {
        await setPriorityOnItem(context, itemId, priorityLabel);
        context.log.info(`Updated priority to ${priorityLabel} for PR #${pull_request.number}`);
      }
    }
  } catch (error) {
    context.log.error(`Error handling PR label: ${error.message}`, error);
  }
}

/**
 * Handles when a PR is edited
 * @param {import('probot').Context} context
 */
export async function handlePullRequestEdited(context) {
  const { pull_request } = context.payload;
  
  context.log.info(`PR #${pull_request.number} edited`);
  
  // Re-check priority labels in case they changed
  await handlePullRequestLabeled(context);
}
