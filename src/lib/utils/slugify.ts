export function slugify(text?: string) {
  return text
    ?.toLowerCase()
    ?.replace(/[^a-zA-Z0-9\s]/gi, '')
    ?.replace(/\s+/g, '-');
}
