# 🚀 Library System Bot - Quick Reference

## 🤖 Bot Commands

### Check Command
Run checks on a specific branch:

```
@library-system-bot check --branch=<branch-name> [--command=<command>]
```

**Examples:**
```
@library-system-bot check --branch=main
@library-system-bot check --branch=feature/auth --command=npm run test
@library-system-bot check --branch=develop --command=docker-compose build
```

### Help Command
Show available commands:

```
@library-system-bot help
```

---

## 🏷️ Label System

### Priority Labels
- `p0` 🔴 - Critical (highest priority)
- `p1` 🟠 - High priority
- `p2` 🟡 - Medium priority
- `p3` 🟢 - Low priority

When you add a priority label to an issue or PR, the bot will automatically update the GitHub Project board.

### Triage Label
- `Triage Needed` - Triggers automatic triage template posting

---

## 🔄 Automatic Workflows

### When you create an issue:
1. ✅ Bot adds it to the project board
2. 📋 If labeled "Triage Needed", bot posts triage template
3. 🎯 If priority label exists, bot sets priority field

### When you create a PR:
1. ✅ Bot adds it to the project board
2. 🎯 If priority label exists, bot sets priority field

### When you label an issue/PR:
1. 🏷️ Bot detects priority labels (p0-p3)
2. 🔄 Updates project board priority field automatically
3. 📋 If "Triage Needed" is added, posts template

---

## ⚙️ Configuration

### Required Environment Variables
```bash
# GitHub App credentials
APP_ID=your_app_id
WEBHOOK_SECRET=your_secret
PRIVATE_KEY=your_private_key

# Project configuration
PROJECT_ID=your_project_node_id
PRIORITY_FIELD_ID=your_priority_field_id

# Priority options
p0=p0_option_id
p1=p1_option_id
p2=p2_option_id
p3=p3_option_id
```

### Optional Variables
```bash
# Status field (optional)
STATUS_FIELD_ID=your_status_field_id
Not_Started=status_option_id
In_Progress=status_option_id
Done=status_option_id
Wont_Fix=status_option_id

# Logging
LOG_LEVEL=debug  # or info, warn, error
```

---

## 📊 GitHub Project Setup

### Finding Your Project ID

1. Go to your GitHub Project (Projects V2)
2. Use the GraphQL Explorer: https://docs.github.com/en/graphql/overview/explorer
3. Run this query:

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

4. Find your project and copy the IDs

---

## 🐛 Troubleshooting

### Bot not responding?
- Check that the bot is installed on your repository
- Verify webhook events are being delivered
- Check the bot logs for errors
- Ensure permissions are correct (Issues: Write, PRs: Write)

### Project features not working?
- Verify `PROJECT_ID` is set correctly
- Check `PRIORITY_FIELD_ID` matches your project field
- Ensure option IDs (p0-p3) are correct

### Commands not working?
- Make sure to mention `@library-system-bot` exactly
- Check command syntax (see examples above)
- Bot ignores its own comments to prevent loops

---

## 📚 Resources

- [Full Documentation](./README.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [GitHub Issues](https://github.com/The-CS-Nerds/library-system-bot/issues)
- [Probot Documentation](https://probot.github.io/docs/)

---

## 💡 Tips & Tricks

### Batch Operations
You can add multiple priority labels at once - the bot will use the highest priority (p0 > p1 > p2 > p3).

### Testing Locally
Use [smee.io](https://smee.io) to forward webhooks to your local development environment:

```bash
npm install -g smee-client
smee -u https://smee.io/YOUR_CHANNEL -t http://localhost:3000/
```

### Custom Commands
Want to add a new command? Check the [Contributing Guide](./CONTRIBUTING.md) for instructions on extending the bot.

---

<sub>🤖 Made with ❤️ by The CS Nerds</sub>
