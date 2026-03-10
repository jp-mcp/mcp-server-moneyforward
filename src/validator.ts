/**
 * Input validation utilities
 * 全ツールの入力値をバリデーション
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/** YYYY-MM-DD 形式チェック */
export function validateDate(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') throw new ValidationError(`${fieldName} must be a string`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ValidationError(`${fieldName} must be YYYY-MM-DD format (got: ${value})`);
  }
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new ValidationError(`${fieldName} is not a valid date`);
  return value;
}

/** 正の整数チェック */
export function validatePositiveInt(value: unknown, fieldName: string, max = 10000): number | undefined {
  if (value === undefined || value === null) return undefined;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new ValidationError(`${fieldName} must be a non-negative integer`);
  }
  if (n > max) throw new ValidationError(`${fieldName} exceeds maximum (${max})`);
  return n;
}

/** ID文字列チェック（英数字+ハイフン+アンダースコア、最大128文字） */
export function validateId(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
  if (value.length > 128) {
    throw new ValidationError(`${fieldName} is too long (max 128 chars)`);
  }
  if (!/^[\w\-]+$/.test(value)) {
    throw new ValidationError(`${fieldName} contains invalid characters`);
  }
  return value;
}

/** 文字列長チェック */
export function validateString(value: unknown, fieldName: string, maxLen = 1000): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') throw new ValidationError(`${fieldName} must be a string`);
  if (value.length > maxLen) {
    throw new ValidationError(`${fieldName} is too long (max ${maxLen} chars)`);
  }
  return value;
}

/** enum チェック */
export function validateEnum(value: unknown, fieldName: string, allowed: string[]): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') throw new ValidationError(`${fieldName} must be a string`);
  if (!allowed.includes(value)) {
    throw new ValidationError(`${fieldName} must be one of: ${allowed.join(', ')}`);
  }
  return value;
}

/** 金額チェック（正の数） */
export function validateAmount(value: unknown, fieldName: string): number {
  if (value === undefined || value === null) {
    throw new ValidationError(`${fieldName} is required`);
  }
  const n = Number(value);
  if (isNaN(n) || n < 0) {
    throw new ValidationError(`${fieldName} must be a non-negative number`);
  }
  if (n > 999999999999) {
    throw new ValidationError(`${fieldName} exceeds maximum amount`);
  }
  return n;
}

/** 配列チェック */
export function validateArray(value: unknown, fieldName: string, maxItems = 100): any[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(`${fieldName} must be an array`);
  }
  if (value.length > maxItems) {
    throw new ValidationError(`${fieldName} exceeds maximum items (${maxItems})`);
  }
  return value;
}
