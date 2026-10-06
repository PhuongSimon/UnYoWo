import { parseCsv } from './csv.js';

describe('parseCsv', () => {
  it('keys rows by the header and trims cells', () => {
    expect(parseCsv('text,meaning_vi\n犬 , con chó\n')).toEqual([{ text: '犬', meaning_vi: 'con chó' }]);
  });

  it('reads quoted fields with commas, doubled quotes and line breaks', () => {
    const rows = parseCsv('text,meaning_vi\r\n"a, b","say ""hi""\nthere"\r\n');
    expect(rows).toEqual([{ text: 'a, b', meaning_vi: 'say "hi"\nthere' }]);
  });

  it('skips blank lines and fills missing trailing cells, ignoring a byte order mark', () => {
    expect(parseCsv('﻿text,note\n\nhallo\n,\n')).toEqual([{ text: 'hallo', note: '' }]);
  });

  it('refuses a file that ends inside quotes', () => {
    expect(() => parseCsv('text\n"open')).toThrow('quoted field');
  });
});
