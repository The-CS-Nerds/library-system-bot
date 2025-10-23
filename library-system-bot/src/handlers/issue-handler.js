import { addToProject, setPriorityOnItem } from '../utils/project.js';
import { pickPriorityLabel, getContentNodeId } from '../utils/helpers.js';
import { postTriageTemplate } from '../utils/triage.js';

/**
 * Handles when a new issue is created
 * @param {import('probot').Context} context
 */
export async function handleIssueOpened(context) {
  const { issue } = context.payload;
  
  context.log.info(`New issue created: #${issue.number} - "${issue.title}"`);
  
  const contentId = getContentNodeId(context.payload);
  if (!contentId) {
    context.log.warn('Could not get content node ID');
    return;
  }

  try {
    // 1. Add issue to project board
    const itemId = await addToProject(context, contentId);
    if (itemId) {
      context.log.info(`Added issue #${issue.number} to project`);
    }

    // 2. Check for triage label
    const labels = (issue.labels || []).map((l) => 
      typeof l === 'string' ? l : l.name
    );
    
    if (labels.includes('Triage Needed')) {
      await postTriageTemplate(context);
      context.log.info(`Posted triage template for issue #${issue.number}`);
    }

    // 3. Set priority if label exists
    const priorityLabel = pickPriorityLabel(context.payload);
    if (priorityLabel && itemId) {
      await setPriorityOnItem(context, itemId, priorityLabel);
      context.log.info(`Set priority ${priorityLabel} for issue #${issue.number}`);
    }
  } catch (error) {
    context.log.error(`Error handling issue creation: ${error.message}`, error);
  }
}

/**
 * Handles when an issue is labeled
 * @param {import('probot').Context} context
 */
export async function handleIssueLabeled(context) {
  const { issue, label } = context.payload;
  
  context.log.info(`Issue #${issue.number} labeled with: ${label?.name}`);

  const contentId = getContentNodeId(context.payload);
  if (!contentId) return;

  try {
    // Check if it's a triage label
    if (label?.name === 'Triage Needed') {
      await postTriageTemplate(context);
      context.log.info(`Posted triage template for issue #${issue.number}`);
    }

    // Check if it's a priority label
    const priorityLabel = pickPriorityLabel(context.payload);
    if (priorityLabel) {
      const itemId = await addToProject(context, contentId);
      if (itemId) {
        await setPriorityOnItem(context, itemId, priorityLabel);
        context.log.info(`Updated priority to ${priorityLabel} for issue #${issue.number}`);
      }
    }
  } catch (error) {
    context.log.error(`❌ Error handling issue label: ${error.message}`, error);
  }
}

/**
 * Handles when an issue is edited
 * @param {import('probot').Context} context
 */
export async function handleIssueEdited(context) {
  const { issue } = context.payload;
  
  context.log.info(`Issue #${issue.number} edited`);
  
  // Re-check priority labels in case they changed
  await handleIssueLabeled(context);
}
