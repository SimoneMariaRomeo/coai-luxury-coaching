# Agent SOP

## Preventing the UTF-8 build failure
- Error signature: `stream did not contain valid UTF-8` for `src/app/topics/[topic]/page.tsx` during `npm run build` / Vercel builds.
- Root cause: Windows editors sometimes paste the Windows-1252 breadcrumb arrow (`\u203a`, byte `0x9B`) into the breadcrumb span. Webpack rejects the non-UTF8 byte.
- Fix every time you touch the breadcrumb:
  1. Open `src/app/topics/[topic]/page.tsx` and ensure the breadcrumb separator reads exactly `<span className="mx-2 text-luxury-text-muted">{'>'}</span>`.
  2. Save the file in UTF-8 (no UTF-16). In PowerShell you can enforce this with:<br>`(Get-Content "src/app/topics/[topic]/page.tsx" -Raw) -replace "\u009B", "{'>'}" | Set-Content "src/app/topics/[topic]/page.tsx" -Encoding UTF8`
  3. Optional sanity check: `python -c "from pathlib import Path; assert b'\x9b' not in Path('src/app/topics/[topic]/page.tsx').read_bytes()"`.
- Run `npm run build` locally after edits; if the error resurfaces, repeat step 2 to strip the rogue byte.
