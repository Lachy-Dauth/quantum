import { notFound } from 'next/navigation'
import { getLesson } from '@/lib/lessons/loader'
import { getPrevNextLessons } from '@/lib/lessons/navigation'
import { TRACK_META, TRACK_COLORS } from '@/lib/tracks'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { TableOfContents } from '@/components/ui/TableOfContents'
import { LessonNav } from '@/components/mdx/LessonNav'
import { Clock, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params

  try {
    const { content, frontmatter, toc } = await getLesson(slug)
    const { prev, next } = getPrevNextLessons(slug)
    const track = frontmatter.track
    const trackMeta = TRACK_META[track]
    const trackColors = TRACK_COLORS[track]

    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: trackMeta.label, href: trackMeta.href },
      { label: frontmatter.title },
    ]

    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="flex gap-10">
          {/* Main content */}
          <article className="min-w-0 flex-1">
            {/* Track accent bar */}
            <div className={cn('mb-6 h-1 w-16 rounded-full', trackColors.accent)} />

            {/* Header */}
            <div className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge track={track} />
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {frontmatter.estimatedMinutes} min
                </span>
              </div>

              <h1 className="text-3xl font-bold text-foreground">{frontmatter.title}</h1>
              {frontmatter.subtitle && (
                <p className="mt-2 text-lg text-muted-foreground">{frontmatter.subtitle}</p>
              )}
            </div>

            {/* Objectives */}
            {frontmatter.objectives.length > 0 && (
              <div className="mb-8 rounded-lg border border-border bg-muted/30 p-6">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <BookOpen className="h-4 w-4" />
                  Learning Objectives
                </h2>
                <ul className="mt-3 space-y-2">
                  {frontmatter.objectives.map((obj) => (
                    <li key={obj} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile TOC */}
            <div className="mb-6 lg:hidden">
              <TableOfContents headings={toc} />
            </div>

            {/* Prose content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">{content}</div>

            {/* Prev/Next navigation */}
            <LessonNav prevSlug={prev} nextSlug={next} />
          </article>

          {/* Desktop TOC sidebar */}
          <TableOfContents headings={toc} className="w-56 flex-shrink-0" />
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}
