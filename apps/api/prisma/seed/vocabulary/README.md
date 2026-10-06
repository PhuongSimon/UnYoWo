# Word lists

One CSV per language and exam level (`en/b1.csv`, `ja/n5.csv`…), UTF-8, editable in a spreadsheet.
Columns, sources, licences and editing rules: [`docs/VOCABULARY_DATA.md`](../../../../../docs/VOCABULARY_DATA.md).

After editing: `pnpm --filter api test`, then `pnpm db:seed`.
