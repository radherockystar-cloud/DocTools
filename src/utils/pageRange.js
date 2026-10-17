// Turns text like "1-3, 5, 8-" into a list of zero-based page indexes.
// Throws an Error with a readable message when the text is not valid.
export function parsePageRanges(input, pageCount) {
  const text = String(input || '').trim();
  if (!text) throw new Error('Enter the pages you want, for example 1-3, 5.');

  const pages = [];
  for (const rawPart of text.split(',')) {
    const part = rawPart.trim();
    if (!part) continue;

    const match = part.match(/^(\d+)\s*(?:(-)\s*(\d*))?$/);
    if (!match) throw new Error(`"${part}" is not a valid page or range. Use numbers like 5 or 2-4.`);

    const start = parseInt(match[1], 10);
    let end = start;
    if (match[2]) end = match[3] ? parseInt(match[3], 10) : pageCount;

    if (start < 1 || end < 1 || start > pageCount || end > pageCount) {
      throw new Error(`Page numbers must be between 1 and ${pageCount}.`);
    }
    if (end < start) throw new Error(`"${part}" goes backwards. Write it as ${end}-${start}.`);

    for (let p = start; p <= end; p++) pages.push(p - 1);
  }

  if (!pages.length) throw new Error('Enter the pages you want, for example 1-3, 5.');
  return pages;
}
