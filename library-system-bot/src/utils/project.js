import { getConfig } from './config.js';

/**
 * Add an issue or PR to the GitHub Project V2
 * @param {import('probot').Context} context
 * @param {string} contentNodeId - The node ID of the issue/PR
 * @returns {Promise<string|null>} The project item ID or null
 */
export async function addToProject(context, contentNodeId) {
  const config = getConfig();
  
  if (!config.projectId) {
    context.log.warn('PROJECT_ID not configured, skipping project operations');
    return null;
  }

  try {
    // Try to add the item to the project
    const added = await context.octokit.graphql(
      `
        mutation($projectId: ID!, $contentId: ID!) {
          addProjectV2ItemById(input: { 
            projectId: $projectId, 
            contentId: $contentId 
          }) {
            item { id }
          }
        }
      `,
      { projectId: config.projectId, contentId: contentNodeId }
    ).catch(() => null);

    if (added?.addProjectV2ItemById?.item?.id) {
      return added.addProjectV2ItemById.item.id;
    }

    // Item might already exist, try to find it
    const found = await findProjectItem(context, config.projectId, contentNodeId);
    return found;
  } catch (error) {
    context.log.error(`Failed to add to project: ${error.message}`, error);
    return null;
  }
}

/**
 * Find an existing project item
 * @param {import('probot').Context} context
 * @param {string} projectId
 * @param {string} contentNodeId
 * @returns {Promise<string|null>}
 */
async function findProjectItem(context, projectId, contentNodeId) {
  try {
    const result = await context.octokit.graphql(
      `
        query($contentId: ID!, $projectId: ID!) {
          node(id: $contentId) {
            ... on Issue {
              projectItems(first: 50, includeArchived: false) {
                nodes { 
                  id 
                  project { id } 
                }
              }
            }
            ... on PullRequest {
              projectItems(first: 50, includeArchived: false) {
                nodes { 
                  id 
                  project { id } 
                }
              }
            }
          }
        }
      `,
      { contentId: contentNodeId, projectId }
    );

    const nodes = result?.node?.projectItems?.nodes || [];
    const item = nodes.find((n) => n.project?.id === projectId);
    
    return item?.id || null;
  } catch (error) {
    context.log.error(`Failed to find project item: ${error.message}`);
    return null;
  }
}

/**
 * Set the priority field on a project item
 * @param {import('probot').Context} context
 * @param {string} itemId - The project item ID
 * @param {string} priorityLabel - The priority label (p0-p3)
 */
export async function setPriorityOnItem(context, itemId, priorityLabel) {
  const config = getConfig();
  
  if (!config.priorityFieldId || !itemId) {
    context.log.warn('Missing priority field ID or item ID');
    return;
  }

  const optionId = config.optionMap[priorityLabel];
  if (!optionId) {
    context.log.warn(`No option ID configured for priority: ${priorityLabel}`);
    return;
  }

  try {
    await context.octokit.graphql(
      `
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
          updateProjectV2ItemFieldValue(input: {
            projectId: $projectId,
            itemId: $itemId,
            fieldId: $fieldId,
            value: { singleSelectOptionId: $optionId }
          }) { 
            clientMutationId 
          }
        }
      `,
      {
        projectId: config.projectId,
        itemId,
        fieldId: config.priorityFieldId,
        optionId
      }
    );
    
    context.log.info(`Successfully set priority to ${priorityLabel}`);
  } catch (error) {
    context.log.error(`Failed to set priority: ${error.message}`, error);
  }
}

/**
 * Set a status field on a project item
 * @param {import('probot').Context} context
 * @param {string} itemId - The project item ID
 * @param {string} status - The status name
 */
export async function setStatusOnItem(context, itemId, status) {
  const config = getConfig();
  
  if (!config.statusFieldId || !itemId) {
    context.log.warn('Missing status field ID or item ID');
    return;
  }

  const optionId = config.statusMap[status];
  if (!optionId) {
    context.log.warn(`No option ID configured for status: ${status}`);
    return;
  }

  try {
    await context.octokit.graphql(
      `
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
          updateProjectV2ItemFieldValue(input: {
            projectId: $projectId,
            itemId: $itemId,
            fieldId: $fieldId,
            value: { singleSelectOptionId: $optionId }
          }) { 
            clientMutationId 
          }
        }
      `,
      {
        projectId: config.projectId,
        itemId,
        fieldId: config.statusFieldId,
        optionId
      }
    );
    
    context.log.info(`Successfully set status to ${status}`);
  } catch (error) {
    context.log.error(`Failed to set status: ${error.message}`, error);
  }
}
