# Contributing to jp-mcp

Thank you for your interest in contributing! 🇯🇵

## How to Contribute

### Bug Reports
- Use [GitHub Issues](https://github.com/jp-mcp/mcp-server-moneyforward/issues)
- Include: steps to reproduce, expected vs actual behavior, environment info
- **Do NOT include API keys or tokens in bug reports**

### Feature Requests
- Open a GitHub Issue with the `enhancement` label
- Describe the use case and expected behavior

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run `npm run build` to ensure it compiles
5. Commit with a descriptive message
6. Push and open a PR

### Code Style
- TypeScript strict mode
- No `any` types where avoidable
- All inputs must be validated (see `src/validator.ts`)
- All errors must be sanitized (see `src/sanitizer.ts`)

## Support Policy

| Type | Where |
|------|-------|
| Bug reports | GitHub Issues ✅ |
| Security issues | See [SECURITY.md](SECURITY.md) |
| Feature requests | GitHub Issues ✅ |
| Setup help | GitHub Discussions (coming soon) |
| Paid support | Contact us |

## Code of Conduct

Be respectful. Be helpful. No harassment, spam, or trolling.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
