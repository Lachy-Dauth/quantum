import { cache } from 'react'
import fs from 'fs/promises'
import path from 'path'
import { renderLesson } from './render'
import { extractToc } from './toc'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'lessons')

async function readLessonSource(slug: string, part?: number): Promise<string> {
  const lessonDir = path.join(CONTENT_DIR, slug)

  let filePath: string
  if (part) {
    filePath = path.join(lessonDir, `part-${part}.mdx`)
  } else {
    // Try index.mdx for single-part lessons
    filePath = path.join(lessonDir, 'index.mdx')
  }

  return fs.readFile(filePath, 'utf-8')
}

export const getLesson = cache(async (slug: string, part?: number) => {
  const source = await readLessonSource(slug, part)
  const { content, frontmatter } = await renderLesson(source)
  const toc = extractToc(source)
  return { content, frontmatter, toc }
})

export async function lessonExists(slug: string, part?: number): Promise<boolean> {
  const lessonDir = path.join(CONTENT_DIR, slug)

  let filePath: string
  if (part) {
    filePath = path.join(lessonDir, `part-${part}.mdx`)
  } else {
    filePath = path.join(lessonDir, 'index.mdx')
  }

  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}
