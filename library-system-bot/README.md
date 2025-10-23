# library-system-bot

> A GitHub App built with [Probot](https://github.com/probot/probot) that automates project management for library-system-v3

## Features

### 🎯 Automatic Project Management
- Automatically adds new issues and pull requests to your GitHub Project V2
- Sets priority based on labels (p0, p1, p2, p3)
- Manages project item status fields

### 📋 Triage Automation
- Detects "Triage Needed" label on issues
- Posts a structured triage template mentioning the dev team
- Includes sections for assessment, priority, impact, and resolution plan

### 🤖 Bot Commands
Mention `@library-system-bot` in issue comments to trigger commands:

#### Check Command
```
@library-system-bot check --branch=<branch-name> --command=<command>
```
- **branch**: The branch to run checks on
- **command**: (Optional) Custom command to execute. Default: `docker-compose -f docker-compose.yml build`

Example:
```
@library-system-bot check --branch=feature/new-auth --command=npm run test
```

## Setup

### Prerequisites
- Node.js >= 18
- A GitHub App configured with appropriate permissions

### Installation

```sh
# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env
```

### Configuration

Edit `.env` and configure the following:

#### Required GitHub App Settings
```bash
APP_ID=<your-github-app-id>
WEBHOOK_SECRET=<your-webhook-secret>
PRIVATE_KEY=<your-private-key>
```

#### Project Configuration
```bash
# Get these from your GitHub Project V2 settings
PROJECT_ID=<project-node-id>
PRIORITY_FIELD_ID=<priority-field-node-id>

# Priority option IDs (from the Priority field)
p0=<p0-option-id>
p1=<p1-option-id>
p2=<p2-option-id>
p3=<p3-option-id>

# Status option IDs (if using status automation)
Not_Started=<status-option-id>
In_Progress=<status-option-id>
Done=<status-option-id>
Wont_Fix=<status-option-id>
```

### Finding Project IDs

To get your Project and Field IDs, use the GitHub GraphQL API Explorer at https://docs.github.com/en/graphql/overview/explorer

```graphql
query {
  organization(login: "YOUR_ORG") {
    projectsV2(first: 10) {
      nodes {
        id
        title
        fields(first: 20) {
          nodes {
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}
```

### Running the Bot

```sh
# Development mode with auto-reload
npm start

# Set log level for debugging
LOG_LEVEL=trace npm start
```

## Docker

```sh
# 1. Build container
docker build -t library-system-bot .

# 2. Start container with environment variables
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> -e PROJECT_ID=<project-id> library-system-bot
```

## GitHub App Permissions

The bot requires the following permissions:

- **Issues**: Read & Write (for creating comments and managing labels)
- **Pull Requests**: Read & Write (for managing PR metadata)
- **Metadata**: Read (for repository access)

## Events

The bot subscribes to:
- `issues.opened`, `issues.labeled`, `issues.edited`
- `pull_request.opened`, `pull_request.labeled`, `pull_request.edited`
- `issue_comment.created`

## Usage Examples

### Automatic Priority Setting
Add a priority label (p0, p1, p2, or p3) to an issue, and the bot will automatically update the project field.

### Triage Template
Create an issue with the "Triage Needed" label, and the bot will post a structured triage template:

```markdown
@The-CS-Nerds/library-devs, please complete the attached triage:

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
- **Other relevant issues/PRs** -
```

## Contributing

If you have suggestions for how library-system-bot could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2025 SuitablyMysterious

---

<sub>This bot was developed with assistance from Claude (Anthropic AI)</sub>
