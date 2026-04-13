import { notFound } from 'next/navigation'
import { getLesson } from '@/lib/lessons/loader'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params

  try {
    const { content, frontmatter } = await getLesson(slug)
    return (
      <article className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold">{frontmatter.title}</h1>
        {frontmatter.subtitle && (
          <p className="mb-8 text-lg text-slate-600">{frontmatter.subtitle}</p>
        )}
        <div className="prose dark:prose-invert max-w-none">{content}</div>
      </article>
    )
  } catch {
    notFound()
  }
}
