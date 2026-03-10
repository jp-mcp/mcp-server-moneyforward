import { sanitizeError, createErrorResponse } from '../sanitizer';

describe('sanitizeError', () => {
  test('masks Bearer tokens', () => {
    const result = sanitizeError('Error: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9 was invalid');
    expect(result).not.toContain('eyJhbGci');
    expect(result).toContain('[REDACTED]');
  });

  test('masks email addresses', () => {
    const result = sanitizeError('User roguresu001@gmail.com not found');
    expect(result).not.toContain('roguresu001@gmail.com');
    expect(result).toContain('[REDACTED]');
  });

  test('masks IP addresses', () => {
    const result = sanitizeError('Connection from 192.168.1.100 refused');
    expect(result).not.toContain('192.168.1.100');
    expect(result).toContain('[REDACTED]');
  });

  test('masks Windows paths', () => {
    const result = sanitizeError('File not found: C:\\Users\\bejir\\secret.txt');
    expect(result).not.toContain('C:\\Users\\bejir');
    expect(result).toContain('[REDACTED]');
  });

  test('masks access_token in response', () => {
    const result = sanitizeError('Response: access_token=abc123def456ghi789');
    expect(result).not.toContain('abc123def456ghi789');
    expect(result).toContain('[REDACTED]');
  });

  test('truncates long messages', () => {
    const longMsg = 'This is a long error message. '.repeat(50);
    const result = sanitizeError(longMsg);
    expect(result.length).toBeLessThanOrEqual(520);
  });

  test('handles Error objects', () => {
    const result = sanitizeError(new Error('simple error'));
    expect(result).toBe('simple error');
  });

  test('handles non-string/non-Error', () => {
    const result = sanitizeError(42);
    expect(result).toBe('An unexpected error occurred');
  });
});

describe('createErrorResponse', () => {
  test('returns auth error for 401', () => {
    const error: any = new Error('unauthorized');
    error.status = 401;
    const result = createErrorResponse(error);
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('Authentication failed');
  });

  test('returns rate limit error for 429', () => {
    const error: any = new Error('too many');
    error.status = 429;
    const result = createErrorResponse(error);
    expect(result.content[0].text).toContain('Rate limit');
  });

  test('returns server error for 500', () => {
    const error: any = new Error('internal');
    error.status = 500;
    const result = createErrorResponse(error);
    expect(result.content[0].text).toContain('server error');
  });

  test('returns not found for 404', () => {
    const error: any = new Error('missing');
    error.status = 404;
    const result = createErrorResponse(error);
    expect(result.content[0].text).toContain('not found');
  });
});
