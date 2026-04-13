import { notFound } from 'next/navigation'
import { getLesson } from '@/lib/lessons/loader'

interface Props {
  params: Promise<{ slug: string; part: string }>
}

export default async function LessonPartPage({ params }: Props) {
  const { slug, part } = await params
  const partNum = parseInt(part, 10)

  if (isNaN(partNum) || partNum < 1) {
    notFound()
  }

  try {
    const { content, frontmatter } = await getLesson(slug, partNum)
    return (
      <article className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">{frontmatter.title}</h1>
        {frontmatter.subtitle && (
          <p className="mb-4 text-lg text-slate-600">{frontmatter.subtitle}</p>
        )}
        <p className="mb-8 text-sm text-slate-400">
          Part {partNum} of {frontmatter.totalParts}
        </p>
        <div className="prose dark:prose-invert max-w-none">{content}</div>
      </article>
    )
  } catch {
    notFound()
  }
}
