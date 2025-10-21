/**
 * Main entrypoint for your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.log.info("library-systembot loaded");

  app.on("issues.opened", async (context) => {
    // check if the issue has a "Triage Needed" label
    const hasTriage = context.payload.issue.labels.some(
      (label) => label.name === "Triage Needed"
    );
    const priorityLabel = context.payload.

    if (hasTriage) {
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
      await context.octokit.issues.createComment(
        context.issue({ body })
      );
    }
    if priorityLabel
  });
};

