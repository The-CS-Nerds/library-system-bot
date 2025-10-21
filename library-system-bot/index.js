/**
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.log.info("library-systembot loaded");

  const PROJECT_ID = process.env.PROJECT_ID; // GitHub Project V2 id
  const PRIORITY_FIELD_ID = process.env.PRIORITY_FIELD_ID;    // "Priority" field id (single-select)
  const OPTION_MAP = {                         // map label -> option id
    p0: process.env.p0,
    p1: process.env.p1,
    p2: process.env.p2,
    p3: process.env.p3
  };

  // helpers
  const pickPriorityLabel = (payload) => {
    const direct = payload.label?.name?.toLowerCase();
    if (direct && /^p[0-3]$/.test(direct)) return direct;

    const labels =
      (payload.issue?.labels || payload.pull_request?.labels || [])
        .map((l) => (typeof l === "string" ? l : l.name?.toLowerCase()))
        .filter(Boolean);

    return labels.find((n) => /^p[0-3]$/.test(n)) || null;
  };

  const getContentNodeId = (payload) =>
    payload.issue?.node_id || payload.pull_request?.node_id || null;

  const ensureProjectItem = async (context, projectId, contentNodeId) => {
    const added = await context.octokit.graphql(
      `
        mutation($projectId: ID!, $contentId: ID!) {
          addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
            item { id }
          }
        }
      `,
      { projectId, contentId: contentNodeId }
    ).catch(() => null);

    if (added?.addProjectV2ItemById?.item?.id) {
      return added.addProjectV2ItemById.item.id;
    }

    const found = await context.octokit.graphql(
      `
        query($contentId: ID!, $projectId: ID!) {
          node(id: $contentId) {
            ... on Issue {
              projectItems(first: 50, includeArchived: false) {
                nodes { id project { id } }
              }
            }
            ... on PullRequest {
              projectItems(first: 50, includeArchived: false) {
                nodes { id project { id } }
              }
            }
          }
        }
      `,
      { contentId: contentNodeId, projectId }
    );

    const nodes = found?.node?.projectItems?.nodes || [];
    const hit = nodes.find((n) => n.project?.id === projectId);
    return hit?.id || null;
  };

  const setPriority = async (context, { projectId, itemId, fieldId, optionId }) => {
    if (!itemId || !optionId) return;
    await context.octokit.graphql(
      `
        mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
          updateProjectV2ItemFieldValue(input: {
            projectId: $projectId,
            itemId: $itemId,
            fieldId: $fieldId,
            value: { singleSelectOptionId: $optionId }
          }) { clientMutationId }
        }
      `,
      { projectId, itemId, fieldId, optionId }
    );
  };

  const maybePostTriage = async (context) => {
    const labels = (context.payload.issue?.labels || []).map((l) => (typeof l === "string" ? l : l.name));
    const hasTriage = labels.includes("Triage Needed");
    if (!hasTriage) return;

    const body = `@The-CS-Nerds/library-devs, please complete the attached triage:

### Assessment:
**Reproducible** - Yes / No  
**Priority** - p0 / p1 / p2 / p3  
**Impact** -  
**Suspected Cause** -  

### Plan for Resolution:
- [ ] **Step 1** -  
- [ ] **Step 2** -  

### Other:
- **Affected files / modules** -  
- **Other relevant issues/PRs** -`;

    await context.octokit.issues.createComment(context.issue({ body }));
  };

  const handler = async (context) => {
    // triage template only applies to issues
    if (context.payload.issue) {
      await maybePostTriage(context);
    }

    const label = pickPriorityLabel(context.payload);
    if (!label) return;

    const contentId = getContentNodeId(context.payload);
    if (!contentId) return;

    const itemId = await ensureProjectItem(context, PROJECT_ID, contentId);
    await setPriority(context, {
      projectId: PROJECT_ID,
      itemId,
      fieldId: PRIORITY_FIELD_ID,
      optionId: OPTION_MAP[label]
    });

    context.log.info(`Set project priority=${label} for item ${itemId}`);
  };

  app.on(
    [
      "issues.opened",
      "issues.labeled",
      "issues.edited",
      "pull_request.opened",
      "pull_request.labeled",
      "pull_request.edited"
    ],
    handler
  );
};
