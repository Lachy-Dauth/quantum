export interface TocEntry {
  id: string
  text: string
  level: number
}

export function extractToc(mdxSource: string): TocEntry[] {
  const entries: TocEntry[] = []
  const lines = mdxSource.split('\n')

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (!match) continue

    const level = match[1]!.length
    const rawText = match[2]!.trim()

    // Strip inline MDX/JSX tags and markdown formatting
    const text = rawText
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim()

    // Generate slug matching rehype-slug (github-slugger algorithm)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    if (text) {
      entries.push({ id, text, level })
    }
  }

  return entries
}
