## Contributing

[fork]: /fork
[pr]: /compare
[code-of-conduct]: CODE_OF_CONDUCT.md

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look at the links below if you're not sure how to open a PR.

## Submitting a pull request

1. [Fork][fork] and clone the repository.
1. Configure and install the dependencies: `npm install`.
1. Make sure the tests pass on your machine: `npm test`, note: these tests also apply the linter, so there's no need to lint separately.
1. Create a new branch: `git checkout -b my-branch-name`.
1. Make your change, add tests, and make sure the tests still pass.
1. Push to your fork and [submit a pull request][pr].
1. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Write and update tests.
- Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

## Development Setup

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Set up your GitHub App:
   - Go to [GitHub Apps settings](https://github.com/settings/apps)
   - Create a new GitHub App
   - Configure permissions and events as specified in `app.yml`
   - Generate a private key
   - Set `APP_ID` and `PRIVATE_KEY` in `.env`

4. Use Smee for local webhook delivery:
   ```bash
   npm install -g smee-client
   smee -u https://smee.io/YOUR_UNIQUE_ID -t http://localhost:3000/
   ```

5. Start the bot:
   ```bash
   npm start
   ```

### Project Structure

```
library-system-bot/
├── src/
│   ├── handlers/          # Event handlers
│   │   ├── issue-handler.js
│   │   ├── pull-request-handler.js
│   │   └── comment-handler.js
│   └── utils/             # Utility functions
│       ├── config.js      # Configuration management
│       ├── helpers.js     # General helpers
│       ├── project.js     # GitHub Project operations
│       ├── triage.js      # Triage template
│       ├── command-parser.js
│       └── check-runner.js
├── test/                  # Tests
├── index.js              # Main entry point
└── package.json
```

### Adding New Features

#### Adding a New Command

1. Update `src/utils/command-parser.js` to parse the new command
2. Create a handler in `src/utils/` for the command logic
3. Update `src/handlers/comment-handler.js` to handle the new command
4. Add tests in `test/`
5. Update the help message in `comment-handler.js`

#### Adding a New Event Handler

1. Create or update a handler in `src/handlers/`
2. Register the handler in `index.js`
3. Update `app.yml` to subscribe to the event
4. Add tests for the new handler

### Testing

Run all tests:
```bash
npm test
```

The bot uses Node's built-in test runner. Tests are located in the `test/` directory.

### Code Style

- Use ES6+ features (the project uses ES modules)
- Add JSDoc comments for functions
- Use descriptive variable names
- Keep functions small and focused
- Use async/await for asynchronous operations

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
- [Probot Documentation](https://probot.github.io/docs/)
- [GitHub Apps Documentation](https://docs.github.com/en/developers/apps)
