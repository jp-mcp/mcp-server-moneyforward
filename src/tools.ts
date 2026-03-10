/**
 * MCP Tool definitions for Money Forward Cloud
 */

export const TOOLS = [
  // === 会計 (Accounting) ===
  {
    name: 'mf_list_deals',
    description: '取引一覧を取得（収入/支出の仕訳データ）。期間・取引先・勘定科目でフィルタ可能。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        start_date: { type: 'string', description: '開始日 (YYYY-MM-DD)' },
        end_date: { type: 'string', description: '終了日 (YYYY-MM-DD)' },
        partner_id: { type: 'string', description: '取引先ID' },
        account_item_id: { type: 'string', description: '勘定科目ID' },
        type: { type: 'string', enum: ['income', 'expense'], description: '収入/支出' },
        limit: { type: 'number', description: '取得件数 (default: 50, max: 100)' },
        offset: { type: 'number', description: 'オフセット' },
      },
    },
  },
  {
    name: 'mf_get_deal',
    description: '取引の詳細を取得。仕訳の内訳（勘定科目・税区分・金額）を含む。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        id: { type: 'string', description: '取引ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'mf_create_deal',
    description: '新しい取引（仕訳）を作成する。収入または支出を登録。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        type: { type: 'string', enum: ['income', 'expense'], description: '収入/支出' },
        issue_date: { type: 'string', description: '発生日 (YYYY-MM-DD)' },
        due_date: { type: 'string', description: '支払期日 (YYYY-MM-DD)' },
        partner_id: { type: 'string', description: '取引先ID' },
        details: {
          type: 'array',
          description: '仕訳明細',
          items: {
            type: 'object',
            properties: {
              account_item_id: { type: 'string', description: '勘定科目ID' },
              tax_code: { type: 'number', description: '税区分コード' },
              amount: { type: 'number', description: '金額' },
              description: { type: 'string', description: '摘要' },
            },
            required: ['account_item_id', 'tax_code', 'amount'],
          },
        },
      },
      required: ['type', 'issue_date', 'details'],
    },
  },
  {
    name: 'mf_list_journals',
    description: '仕訳帳データをダウンロード（CSV/PDF）。月次決算の確認に使用。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        start_date: { type: 'string', description: '開始日 (YYYY-MM-DD)' },
        end_date: { type: 'string', description: '終了日 (YYYY-MM-DD)' },
      },
      required: ['start_date', 'end_date'],
    },
  },
  {
    name: 'mf_list_accounts',
    description: '勘定科目一覧を取得。取引作成時の科目ID参照に使用。',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'mf_list_partners',
    description: '取引先一覧を取得。名前で検索可能。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        keyword: { type: 'string', description: '検索キーワード（取引先名）' },
        limit: { type: 'number', description: '取得件数' },
      },
    },
  },
  {
    name: 'mf_get_trial_balance',
    description: '試算表（残高試算表/損益計算書）を取得。月次・年次の財務状況確認。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        fiscal_year: { type: 'number', description: '会計年度' },
        start_month: { type: 'number', description: '開始月' },
        end_month: { type: 'number', description: '終了月' },
      },
      required: ['fiscal_year'],
    },
  },
  {
    name: 'mf_list_wallets',
    description: '口座一覧と残高を取得。銀行口座・クレジットカード・現金の残高確認。',
    inputSchema: { type: 'object' as const, properties: {} },
  },

  // === 請求書 (Invoice) ===
  {
    name: 'mf_list_invoices',
    description: '請求書一覧を取得。ステータス（下書き/送付済み/入金済み等）でフィルタ可能。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string', enum: ['draft', 'sent', 'paid', 'overdue'], description: 'ステータス' },
        partner_name: { type: 'string', description: '取引先名' },
        from_date: { type: 'string', description: '開始日' },
        to_date: { type: 'string', description: '終了日' },
      },
    },
  },
  {
    name: 'mf_get_invoice',
    description: '請求書の詳細を取得。明細行・合計金額・消費税額を含む。',
    inputSchema: {
      type: 'object' as const,
      properties: { id: { type: 'string', description: '請求書ID' } },
      required: ['id'],
    },
  },
  {
    name: 'mf_create_invoice',
    description: '新しい請求書を作成する。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        partner_id: { type: 'string', description: '取引先ID' },
        billing_date: { type: 'string', description: '請求日 (YYYY-MM-DD)' },
        due_date: { type: 'string', description: '支払期日 (YYYY-MM-DD)' },
        items: {
          type: 'array',
          description: '請求明細',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '品名' },
              quantity: { type: 'number', description: '数量' },
              unit_price: { type: 'number', description: '単価' },
              tax_type: { type: 'string', description: '税区分' },
            },
            required: ['name', 'quantity', 'unit_price'],
          },
        },
      },
      required: ['partner_id', 'billing_date', 'due_date', 'items'],
    },
  },

  // === 経費 (Expense) ===
  {
    name: 'mf_list_expenses',
    description: '経費申請一覧を取得。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        status: { type: 'string', description: 'ステータス' },
        from_date: { type: 'string', description: '開始日' },
        to_date: { type: 'string', description: '終了日' },
      },
    },
  },
  {
    name: 'mf_create_expense',
    description: '新しい経費を登録する。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        amount: { type: 'number', description: '金額' },
        description: { type: 'string', description: '内容' },
        expense_date: { type: 'string', description: '利用日 (YYYY-MM-DD)' },
        category: { type: 'string', description: '経費カテゴリ' },
      },
      required: ['amount', 'description', 'expense_date'],
    },
  },

  // === 給与 (Payroll) ===
  {
    name: 'mf_list_employees',
    description: '従業員一覧を取得。',
    inputSchema: {
      type: 'object' as const,
      properties: {
        limit: { type: 'number', description: '取得件数' },
      },
    },
  },

  // === 共通 ===
  {
    name: 'mf_get_office',
    description: '接続中の事業所情報を取得。事業所名・プラン・会計年度を確認。',
    inputSchema: { type: 'object' as const, properties: {} },
  },
];
