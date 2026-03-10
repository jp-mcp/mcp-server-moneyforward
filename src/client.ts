/**
 * Money Forward Cloud API Client
 * OAuth2.0 + APIキー認証対応
 */

interface MFConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  apiKey: string;
  officeId: string;
}

export class MoneyForwardClient {
  private config: MFConfig;
  private baseUrl = 'https://accounting.moneyforward.com/api/v3';
  private invoiceBaseUrl = 'https://invoice.moneyforward.com/api/v3';

  constructor(config: MFConfig) {
    this.config = config;
  }

  private async request(path: string, options: RequestInit = {}, base?: string): Promise<any> {
    const url = `${base || this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // APIキー認証 or OAuth2
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    } else if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`MF API Error ${response.status}: ${errorBody}`);
    }

    return response.json();
  }

  // === 会計 (Accounting) ===

  async listDeals(params?: any): Promise<any> {
    const query = new URLSearchParams();
    if (params?.start_date) query.set('start_date', params.start_date);
    if (params?.end_date) query.set('end_date', params.end_date);
    if (params?.partner_id) query.set('partner_id', params.partner_id);
    if (params?.account_item_id) query.set('account_item_id', params.account_item_id);
    if (params?.type) query.set('type', params.type);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString();
    return this.request(`/offices/${this.config.officeId}/deals${qs ? '?' + qs : ''}`);
  }

  async getDeal(id: string): Promise<any> {
    return this.request(`/offices/${this.config.officeId}/deals/${id}`);
  }

  async createDeal(data: any): Promise<any> {
    return this.request(`/offices/${this.config.officeId}/deals`, {
      method: 'POST',
      body: JSON.stringify({ deal: data }),
    });
  }

  async listJournals(params: any): Promise<any> {
    const query = new URLSearchParams({
      start_date: params.start_date,
      end_date: params.end_date,
    });
    return this.request(`/offices/${this.config.officeId}/journals?${query}`);
  }

  async listAccounts(): Promise<any> {
    return this.request(`/offices/${this.config.officeId}/account_items`);
  }

  async listPartners(params?: any): Promise<any> {
    const query = new URLSearchParams();
    if (params?.keyword) query.set('keyword', params.keyword);
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return this.request(`/offices/${this.config.officeId}/partners${qs ? '?' + qs : ''}`);
  }

  async getTrialBalance(params: any): Promise<any> {
    const query = new URLSearchParams({
      fiscal_year: String(params.fiscal_year),
    });
    if (params?.start_month) query.set('start_month', String(params.start_month));
    if (params?.end_month) query.set('end_month', String(params.end_month));
    return this.request(`/offices/${this.config.officeId}/reports/trial_bs?${query}`);
  }

  async listWallets(): Promise<any> {
    return this.request(`/offices/${this.config.officeId}/wallets`);
  }

  // === 請求書 (Invoice) ===

  async listInvoices(params?: any): Promise<any> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.partner_name) query.set('partner_name', params.partner_name);
    if (params?.from_date) query.set('from_date', params.from_date);
    if (params?.to_date) query.set('to_date', params.to_date);
    const qs = query.toString();
    return this.request(`/invoices${qs ? '?' + qs : ''}`, {}, this.invoiceBaseUrl);
  }

  async getInvoice(id: string): Promise<any> {
    return this.request(`/invoices/${id}`, {}, this.invoiceBaseUrl);
  }

  async createInvoice(data: any): Promise<any> {
    return this.request(`/invoices`, {
      method: 'POST',
      body: JSON.stringify({ invoice: data }),
    }, this.invoiceBaseUrl);
  }

  // === 経費 (Expense) ===

  async listExpenses(params?: any): Promise<any> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.from_date) query.set('from_date', params.from_date);
    if (params?.to_date) query.set('to_date', params.to_date);
    const qs = query.toString();
    return this.request(`/offices/${this.config.officeId}/expenses${qs ? '?' + qs : ''}`);
  }

  async createExpense(data: any): Promise<any> {
    return this.request(`/offices/${this.config.officeId}/expenses`, {
      method: 'POST',
      body: JSON.stringify({ expense: data }),
    });
  }

  // === 給与 (Payroll) ===

  async listEmployees(params?: any): Promise<any> {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return this.request(`/offices/${this.config.officeId}/employees${qs ? '?' + qs : ''}`);
  }

  // === 共通 ===

  async getOffice(): Promise<any> {
    return this.request(`/offices/${this.config.officeId}`);
  }
}
