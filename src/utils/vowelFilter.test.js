import { expect, test, describe } from 'vitest'
import vowelFilter from './vowelFilter';

describe('vowelFilter', () => {
  test('returns false when no words contain X between two vowels', () => {
    expect(vowelFilter(['hello', 'world'])).toBe(false);
  });

  test('returns true when a word contains X between two vowels', () => {
    expect(vowelFilter(['hello', 'aXe'])).toBe(true);
  });

  test('returns false when a word contains x between two vowels', () => {
    expect(vowelFilter(['hello', 'bececbecca'])).toBe(false);
  });

  test('returns false when given an empty array', () => {
    expect(vowelFilter([])).toBe(false);
  });

  test('returns false when given an empty string', () => {
    expect(vowelFilter([''])).toBe(false);
  });

  test('returns false when given undefined', () => {
    expect(vowelFilter(undefined)).toBe(false);
  });
});
