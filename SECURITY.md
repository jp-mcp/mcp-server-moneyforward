# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅ Yes    |

## Reporting a Vulnerability

**Do NOT open a public GitHub Issue for security vulnerabilities.**

Please report security issues to: **security@jp-mcp.dev** (coming soon)

Until the email is set up, please use [GitHub Security Advisories](https://github.com/jp-mcp/mcp-server-moneyforward/security/advisories/new) to report vulnerabilities privately.

### What to include

- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Suggested fix (if any)

### Response timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix release:** Within 2 weeks for critical issues

## Security Design Principles

This MCP server follows these security principles:

1. **Pass-through design** — No user data is stored on the server. All data flows directly between the AI client and Money Forward APIs.
2. **No hardcoded credentials** — All authentication tokens are passed via environment variables.
3. **Input validation** — All tool inputs are validated before being sent to APIs.
4. **Error sanitization** — API error responses are sanitized to prevent leaking sensitive information (tokens, internal paths, etc.).
5. **Rate limiting** — Built-in request throttling and exponential backoff to prevent API abuse.
6. **Minimal dependencies** — Only essential packages are included to reduce supply chain risk.

## Credential Handling

- **NEVER** put API keys or tokens in code or config files
- **ALWAYS** use environment variables (`MF_API_KEY`, `MF_ACCESS_TOKEN`)
- Tokens are sent only in `Authorization` headers over HTTPS
- No logging of authentication headers
