#!/usr/bin/env node
/**
 * MCP Server for Money Forward Cloud
 * マネーフォワード クラウド API 対応 MCPサーバー
 *
 * 対応サービス:
 * - クラウド会計 (Accounting)
 * - クラウド請求書 (Invoice)
 * - クラウド経費 (Expense)
 * - クラウド給与 (Payroll)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { MoneyForwardClient } from './client.js';
import { TOOLS } from './tools.js';

const client = new MoneyForwardClient({
  clientId: process.env.MF_CLIENT_ID || '',
  clientSecret: process.env.MF_CLIENT_SECRET || '',
  accessToken: process.env.MF_ACCESS_TOKEN || '',
  apiKey: process.env.MF_API_KEY || '',
  officeId: process.env.MF_OFFICE_ID || '',
});

const server = new Server(
  {
    name: 'mcp-server-moneyforward',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// === Tools ===
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // === 会計 (Accounting) ===
      case 'mf_list_deals':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listDeals(args), null, 2) }] };
      case 'mf_get_deal':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getDeal(args?.id as string), null, 2) }] };
      case 'mf_create_deal':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createDeal(args), null, 2) }] };
      case 'mf_list_journals':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listJournals(args), null, 2) }] };
      case 'mf_list_accounts':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listAccounts(), null, 2) }] };
      case 'mf_list_partners':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listPartners(args), null, 2) }] };
      case 'mf_get_trial_balance':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getTrialBalance(args), null, 2) }] };
      case 'mf_list_wallets':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listWallets(), null, 2) }] };

      // === 請求書 (Invoice) ===
      case 'mf_list_invoices':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listInvoices(args), null, 2) }] };
      case 'mf_get_invoice':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getInvoice(args?.id as string), null, 2) }] };
      case 'mf_create_invoice':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createInvoice(args), null, 2) }] };

      // === 経費 (Expense) ===
      case 'mf_list_expenses':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listExpenses(args), null, 2) }] };
      case 'mf_create_expense':
        return { content: [{ type: 'text', text: JSON.stringify(await client.createExpense(args), null, 2) }] };

      // === 給与 (Payroll) ===
      case 'mf_list_employees':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listEmployees(args), null, 2) }] };

      // === 共通 ===
      case 'mf_get_office':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getOffice(), null, 2) }] };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// === Resources ===
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'mf://office/info',
      name: '事業所情報',
      description: '接続中のマネーフォワード クラウド事業所の情報',
      mimeType: 'application/json',
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  if (uri === 'mf://office/info') {
    const info = await client.getOffice();
    return {
      contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(info, null, 2) }],
    };
  }
  throw new Error(`Unknown resource: ${uri}`);
});

// === Start ===
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server for Money Forward Cloud started');
}

main().catch(console.error);
