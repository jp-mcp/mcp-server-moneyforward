import {
  validateDate,
  validatePositiveInt,
  validateId,
  validateString,
  validateEnum,
  validateAmount,
  validateArray,
  ValidationError,
} from '../validator';

describe('validateDate', () => {
  test('accepts valid YYYY-MM-DD', () => {
    expect(validateDate('2026-03-11', 'date')).toBe('2026-03-11');
  });

  test('accepts undefined', () => {
    expect(validateDate(undefined, 'date')).toBeUndefined();
  });

  test('accepts empty string', () => {
    expect(validateDate('', 'date')).toBeUndefined();
  });

  test('rejects invalid format', () => {
    expect(() => validateDate('03/11/2026', 'date')).toThrow(ValidationError);
  });

  test('rejects non-string', () => {
    expect(() => validateDate(12345, 'date')).toThrow(ValidationError);
  });

  test('rejects invalid date', () => {
    expect(() => validateDate('2026-13-01', 'date')).toThrow(ValidationError);
  });
});

describe('validatePositiveInt', () => {
  test('accepts valid integer', () => {
    expect(validatePositiveInt(50, 'limit')).toBe(50);
  });

  test('accepts zero', () => {
    expect(validatePositiveInt(0, 'offset')).toBe(0);
  });

  test('accepts undefined', () => {
    expect(validatePositiveInt(undefined, 'limit')).toBeUndefined();
  });

  test('rejects negative', () => {
    expect(() => validatePositiveInt(-1, 'limit')).toThrow(ValidationError);
  });

  test('rejects exceeding max', () => {
    expect(() => validatePositiveInt(200, 'limit', 100)).toThrow(ValidationError);
  });

  test('rejects float', () => {
    expect(() => validatePositiveInt(3.14, 'limit')).toThrow(ValidationError);
  });
});

describe('validateId', () => {
  test('accepts valid ID', () => {
    expect(validateId('abc-123_DEF', 'id')).toBe('abc-123_DEF');
  });

  test('rejects empty string', () => {
    expect(() => validateId('', 'id')).toThrow(ValidationError);
  });

  test('rejects special characters', () => {
    expect(() => validateId('abc!@#', 'id')).toThrow(ValidationError);
  });

  test('rejects too long', () => {
    expect(() => validateId('a'.repeat(200), 'id')).toThrow(ValidationError);
  });
});

describe('validateString', () => {
  test('accepts valid string', () => {
    expect(validateString('hello', 'name')).toBe('hello');
  });

  test('accepts Japanese', () => {
    expect(validateString('マネーフォワード', 'name')).toBe('マネーフォワード');
  });

  test('accepts undefined', () => {
    expect(validateString(undefined, 'name')).toBeUndefined();
  });

  test('rejects too long', () => {
    expect(() => validateString('a'.repeat(2000), 'name', 1000)).toThrow(ValidationError);
  });
});

describe('validateEnum', () => {
  test('accepts valid value', () => {
    expect(validateEnum('income', 'type', ['income', 'expense'])).toBe('income');
  });

  test('accepts undefined', () => {
    expect(validateEnum(undefined, 'type', ['income', 'expense'])).toBeUndefined();
  });

  test('rejects invalid value', () => {
    expect(() => validateEnum('invalid', 'type', ['income', 'expense'])).toThrow(ValidationError);
  });
});

describe('validateAmount', () => {
  test('accepts valid amount', () => {
    expect(validateAmount(10000, 'amount')).toBe(10000);
  });

  test('accepts zero', () => {
    expect(validateAmount(0, 'amount')).toBe(0);
  });

  test('rejects negative', () => {
    expect(() => validateAmount(-100, 'amount')).toThrow(ValidationError);
  });

  test('rejects undefined (required)', () => {
    expect(() => validateAmount(undefined, 'amount')).toThrow(ValidationError);
  });

  test('rejects exceeding max', () => {
    expect(() => validateAmount(9999999999999, 'amount')).toThrow(ValidationError);
  });
});

describe('validateArray', () => {
  test('accepts valid array', () => {
    expect(validateArray([1, 2, 3], 'items')).toEqual([1, 2, 3]);
  });

  test('rejects non-array', () => {
    expect(() => validateArray('not an array', 'items')).toThrow(ValidationError);
  });

  test('rejects exceeding max items', () => {
    expect(() => validateArray(new Array(200), 'items', 100)).toThrow(ValidationError);
  });
});
