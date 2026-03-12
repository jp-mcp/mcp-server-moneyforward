# @jp-mcp/server-moneyforward

[![npm version](https://badge.fury.io/js/%40jp-mcp%2Fserver-moneyforward.svg)](https://www.npmjs.com/package/@jp-mcp/server-moneyforward)
[![CI](https://github.com/jp-mcp/mcp-server-moneyforward/actions/workflows/ci.yml/badge.svg)](https://github.com/jp-mcp/mcp-server-moneyforward/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests](https://img.shields.io/badge/tests-43%20passed-brightgreen)](https://github.com/jp-mcp/mcp-server-moneyforward)

[日本語](#日本語) | [English](#english)

---

## 日本語

マネーフォワード クラウドの各サービスにAIエージェントから直接アクセスできる、**オープンソースのMCPサーバー**です。

> **Note:** マネーフォワード社は公式MCPサーバーβ版を提供していますが、公認メンバー（プラチナ）限定の招待制です。本サーバーは**誰でも即インストールして使えるOSS版**として、テスト43本・CI完備の品質で提供しています。

### 特徴

- 🔧 **16ツール** — 会計・請求書・経費・給与の4サービスに対応
- ✅ **テスト43本** — バリデーション・サニタイズ・レートリミット含む
- 🔒 **セキュリティ** — 入力サニタイズ・レートリミット・APIキー環境変数管理
- 📦 **即使える** — `npx` 1行で起動。インストール不要
- 🇯🇵 **日本語フルサポート** — README・エラーメッセージ・ツール説明すべて日本語対応
- 🤖 **MCP SDK準拠** — Claude Desktop / Cursor / 任意のMCPクライアントで動作

### 対応サービス

| サービス | ステータス | 機能 |
|----------|-----------|------|
| クラウド会計 | ✅ 対応済み | 取引CRUD / 仕訳帳 / 勘定科目 / 取引先 / 試算表 / 口座残高 |
| クラウド請求書 | ✅ 対応済み | 請求書一覧 / 作成 / 詳細取得 |
| クラウド経費 | ✅ 対応済み | 経費申請一覧 / 登録 |
| クラウド給与 | 🔧 基本対応 | 従業員一覧 |

### クイックスタート

```bash
# npxで直接実行（インストール不要）
npx @jp-mcp/server-moneyforward

# またはグローバルインストール
npm install -g @jp-mcp/server-moneyforward
```

### 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `MF_ACCESS_TOKEN` | ◎ | OAuth2.0 アクセストークン |
| `MF_API_KEY` | ◎ | APIキー（サーバー間通信用） |
| `MF_OFFICE_ID` | ◎ | 事業所ID |
| `MF_CLIENT_ID` | △ | OAuth2.0 Client ID |
| `MF_CLIENT_SECRET` | △ | OAuth2.0 Client Secret |

*`MF_ACCESS_TOKEN` または `MF_API_KEY` のどちらか一方が必須です。

### Claude Desktop での設定

`claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "moneyforward": {
      "command": "npx",
      "args": ["@jp-mcp/server-moneyforward"],
      "env": {
        "MF_API_KEY": "your-api-key",
        "MF_OFFICE_ID": "your-office-id"
      }
    }
  }
}
```

### 使い方の例

AIに以下のような指示ができます：

- 「今月の売上を集計して」
- 「未払いの請求書一覧を見せて」
- 「先月の試算表を出して」
- 「取引先○○への請求書を作成して」
- 「今月の経費を一覧表示して」
- 「口座残高を確認して」

### ツール一覧（16ツール）

| ツール名 | 説明 |
|---------|------|
| `mf_list_deals` | 取引一覧（期間・取引先でフィルタ） |
| `mf_get_deal` | 取引詳細 |
| `mf_create_deal` | 取引作成 |
| `mf_update_deal` | 取引更新 |
| `mf_list_journals` | 仕訳帳データ |
| `mf_list_accounts` | 勘定科目一覧 |
| `mf_list_partners` | 取引先一覧（検索可能） |
| `mf_get_trial_balance` | 試算表 |
| `mf_list_wallets` | 口座残高一覧 |
| `mf_list_invoices` | 請求書一覧 |
| `mf_get_invoice` | 請求書詳細 |
| `mf_create_invoice` | 請求書作成 |
| `mf_list_expenses` | 経費一覧 |
| `mf_create_expense` | 経費登録 |
| `mf_list_employees` | 従業員一覧 |
| `mf_get_office` | 事業所情報 |

### セキュリティ

- APIキーはすべて環境変数で管理（コード内にハードコードしない）
- 入力パラメータのバリデーション・サニタイズ
- レートリミット（429レスポンス対応）
- 詳細は [SECURITY.md](SECURITY.md) を参照

### テスト

```bash
npm test
# 43 tests passed
```

---

## English

Open-source MCP Server for [Money Forward Cloud](https://biz.moneyforward.com/) — Japan's leading cloud accounting platform with 100,000+ business users.

> **Note:** Money Forward Inc. offers an official MCP server (β), but it is invite-only for certified Platinum members. This server is a **fully open-source alternative** available to anyone via npm, with 43 tests and full CI coverage.

### Features

- 🔧 **16 tools** — Accounting, Invoicing, Expenses, Payroll
- ✅ **43 tests** — Validation, sanitization, rate limiting
- 🔒 **Security-first** — Input sanitization, rate limiting, env-based key management
- 📦 **Zero-install** — Run with `npx` instantly
- 🇯🇵 **Full Japanese support** — README, errors, tool descriptions
- 🤖 **MCP SDK compliant** — Works with Claude Desktop, Cursor, any MCP client

### Quick Start

```bash
npx @jp-mcp/server-moneyforward
```

### Supported Services

| Service | Status | Features |
|---------|--------|----------|
| Cloud Accounting | ✅ Ready | Deals CRUD / Journals / Accounts / Partners / Trial Balance / Wallets |
| Cloud Invoice | ✅ Ready | List / Create / Get invoices |
| Cloud Expense | ✅ Ready | List / Create expenses |
| Cloud Payroll | 🔧 Basic | Employee list |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MF_ACCESS_TOKEN` | Yes* | OAuth2.0 access token |
| `MF_API_KEY` | Yes* | API key (for server-to-server) |
| `MF_OFFICE_ID` | Yes | Office/Company ID |

*Either `MF_ACCESS_TOKEN` or `MF_API_KEY` is required.

### License

MIT

### Contributing

Issues and PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

---

Made with 🖤 by [jp-mcp](https://github.com/jp-mcp) — Building open-source MCP servers for Japanese SaaS
