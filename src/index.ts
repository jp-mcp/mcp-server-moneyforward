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
import { createErrorResponse } from './sanitizer.js';
import { ValidationError, validateDate, validateId, validateString, validateEnum, validatePositiveInt, validateAmount, validateArray } from './validator.js';

const client = new MoneyForwardClient({
  clientId: process.env.MF_CLIENT_ID || '',
  clientSecret: process.env.MF_CLIENT_SECRET || '',
  accessToken: process.env.MF_ACCESS_TOKEN || '',
  refreshToken: process.env.MF_REFRESH_TOKEN || '',
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
      // === テナント (Auth) ===
      case 'mf_get_tenant': {
        return { content: [{ type: 'text', text: JSON.stringify(await client.getTenant(), null, 2) }] };
      }

      // === 会計 (Accounting) ===
      case 'mf_list_deals': {
        const params = {
          start_date: validateDate(args?.start_date, 'start_date'),
          end_date: validateDate(args?.end_date, 'end_date'),
          partner_id: validateString(args?.partner_id, 'partner_id', 128),
          account_item_id: validateString(args?.account_item_id, 'account_item_id', 128),
          type: validateEnum(args?.type, 'type', ['income', 'expense']),
          limit: validatePositiveInt(args?.limit, 'limit', 100),
          offset: validatePositiveInt(args?.offset, 'offset'),
        };
        return { content: [{ type: 'text', text: JSON.stringify(await client.listDeals(params), null, 2) }] };
      }

      case 'mf_get_deal': {
        const id = validateId(args?.id, 'id');
        return { content: [{ type: 'text', text: JSON.stringify(await client.getDeal(id), null, 2) }] };
      }

      case 'mf_create_deal': {
        validateEnum(args?.type, 'type', ['income', 'expense']);
        validateDate(args?.issue_date, 'issue_date');
        validateArray(args?.details, 'details', 50);
        return { content: [{ type: 'text', text: JSON.stringify(await client.createDeal(args), null, 2) }] };
      }

      case 'mf_list_journals': {
        const params = {
          start_date: validateDate(args?.start_date, 'start_date'),
          end_date: validateDate(args?.end_date, 'end_date'),
        };
        if (!params.start_date || !params.end_date) {
          throw new ValidationError('start_date and end_date are required');
        }
        return { content: [{ type: 'text', text: JSON.stringify(await client.listJournals(params), null, 2) }] };
      }

      case 'mf_list_accounts':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listAccounts(), null, 2) }] };

      case 'mf_list_partners': {
        const params = {
          keyword: validateString(args?.keyword, 'keyword', 200),
          limit: validatePositiveInt(args?.limit, 'limit', 100),
        };
        return { content: [{ type: 'text', text: JSON.stringify(await client.listPartners(params), null, 2) }] };
      }

      case 'mf_get_trial_balance': {
        const params = {
          fiscal_year: validatePositiveInt(args?.fiscal_year, 'fiscal_year', 2100),
          start_month: validatePositiveInt(args?.start_month, 'start_month', 12),
          end_month: validatePositiveInt(args?.end_month, 'end_month', 12),
        };
        if (!params.fiscal_year) throw new ValidationError('fiscal_year is required');
        return { content: [{ type: 'text', text: JSON.stringify(await client.getTrialBalance(params), null, 2) }] };
      }

      case 'mf_list_wallets':
        return { content: [{ type: 'text', text: JSON.stringify(await client.listWallets(), null, 2) }] };

      // === 請求書 (Invoice) ===
      case 'mf_list_invoices': {
        const params = {
          status: validateEnum(args?.status, 'status', ['draft', 'sent', 'paid', 'overdue']),
          partner_name: validateString(args?.partner_name, 'partner_name', 200),
          from_date: validateDate(args?.from_date, 'from_date'),
          to_date: validateDate(args?.to_date, 'to_date'),
        };
        return { content: [{ type: 'text', text: JSON.stringify(await client.listInvoices(params), null, 2) }] };
      }

      case 'mf_get_invoice': {
        const id = validateId(args?.id, 'id');
        return { content: [{ type: 'text', text: JSON.stringify(await client.getInvoice(id), null, 2) }] };
      }

      case 'mf_create_invoice': {
        validateId(args?.partner_id, 'partner_id');
        validateDate(args?.billing_date, 'billing_date');
        validateDate(args?.due_date, 'due_date');
        validateArray(args?.items, 'items', 100);
        return { content: [{ type: 'text', text: JSON.stringify(await client.createInvoice(args), null, 2) }] };
      }

      // === 経費 (Expense) ===
      case 'mf_list_expenses': {
        const params = {
          status: validateString(args?.status, 'status', 50),
          from_date: validateDate(args?.from_date, 'from_date'),
          to_date: validateDate(args?.to_date, 'to_date'),
        };
        return { content: [{ type: 'text', text: JSON.stringify(await client.listExpenses(params), null, 2) }] };
      }

      case 'mf_create_expense': {
        validateAmount(args?.amount, 'amount');
        validateString(args?.description, 'description', 500);
        validateDate(args?.expense_date, 'expense_date');
        return { content: [{ type: 'text', text: JSON.stringify(await client.createExpense(args), null, 2) }] };
      }

      // === 給与 (Payroll) ===
      case 'mf_list_employees': {
        const params = {
          limit: validatePositiveInt(args?.limit, 'limit', 100),
        };
        return { content: [{ type: 'text', text: JSON.stringify(await client.listEmployees(params), null, 2) }] };
      }

      // === 共通 ===
      case 'mf_get_office':
        return { content: [{ type: 'text', text: JSON.stringify(await client.getOffice(), null, 2) }] };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return {
        content: [{ type: 'text', text: `Validation Error: ${error.message}` }],
        isError: true,
      };
    }
    return createErrorResponse(error);
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
