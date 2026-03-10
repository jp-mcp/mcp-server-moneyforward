/**
 * Error sanitization — 機密情報の漏洩防止
 * APIエラーレスポンスからトークン・内部情報を除去
 */

const SENSITIVE_PATTERNS = [
  // Bearer tokens
  /Bearer\s+[A-Za-z0-9\-._~+\/]+=*/gi,
  // API keys (common formats)
  /[A-Za-z0-9]{32,}/g,
  // OAuth tokens
  /access_token["\s:=]+[^\s"&]+/gi,
  /refresh_token["\s:=]+[^\s"&]+/gi,
  /client_secret["\s:=]+[^\s"&]+/gi,
  // Email in error context
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  // IP addresses
  /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  // Internal paths
  /[A-Z]:\\[^\s"]+/g,
  /\/home\/[^\s"]+/g,
];

/**
 * Sanitize error message for safe output
 * 内部情報をマスクしてユーザーに安全なメッセージを返す
 */
export function sanitizeError(error: any): string {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else {
    message = 'An unexpected error occurred';
  }

  // Remove sensitive patterns
  for (const pattern of SENSITIVE_PATTERNS) {
    message = message.replace(pattern, '[REDACTED]');
  }

  // Truncate very long error messages (API might dump huge responses)
  if (message.length > 500) {
    message = message.substring(0, 500) + '... [truncated]';
  }

  return message;
}

/**
 * Create a user-friendly error response
 */
export function createErrorResponse(error: any) {
  const statusCode = error?.status || error?.statusCode;
  const sanitized = sanitizeError(error);

  let userMessage: string;

  if (statusCode === 401 || statusCode === 403) {
    userMessage = 'Authentication failed. Please check your MF_ACCESS_TOKEN or MF_API_KEY.';
  } else if (statusCode === 404) {
    userMessage = 'Resource not found. Please check the ID or parameters.';
  } else if (statusCode === 429) {
    userMessage = 'Rate limit exceeded. Please wait a moment and try again.';
  } else if (statusCode >= 500) {
    userMessage = 'Money Forward API server error. Please try again later.';
  } else {
    userMessage = sanitized;
  }

  return {
    content: [{ type: 'text' as const, text: `Error: ${userMessage}` }],
    isError: true,
  };
}
