import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getLesson } from '@/lib/lessons/loader'
import { getPrevNextLessons } from '@/lib/lessons/navigation'
import { LESSON_META, lessonHref } from '@/lib/lessons/data'
import { TRACK_META, TRACK_COLORS } from '@/lib/tracks'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { TableOfContents } from '@/components/ui/TableOfContents'
import { Clock, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string; part: string }>
}

export default async function LessonPartPage({ params }: Props) {
  const { slug, part } = await params
  const partNum = parseInt(part.replace('part-', ''), 10)

  if (isNaN(partNum) || partNum < 1) {
    notFound()
  }

  try {
    const { content, frontmatter, toc } = await getLesson(slug, partNum)
    const { prev, next } = getPrevNextLessons(slug)
    const track = frontmatter.track
    const trackMeta = TRACK_META[track]
    const trackColors = TRACK_COLORS[track]

    const breadcrumbItems = [
      { label: 'Home', href: '/' },
      { label: trackMeta.label, href: trackMeta.href },
      { label: frontmatter.title, href: `/lessons/${slug}` },
      { label: `Part ${partNum}` },
    ]

    const prevPart = partNum > 1 ? partNum - 1 : null
    const nextPart = partNum < frontmatter.totalParts ? partNum + 1 : null

    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10">
          {/* Main content */}
          <article className="min-w-0 flex-1">
            {/* Track accent bar */}
            <div className={cn('mb-6 h-1 w-16 rounded-full', trackColors.accent)} />

            {/* Header */}
            <div className="mb-8">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge track={track} />
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  Part {partNum} of {frontmatter.totalParts}
                </span>
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

            {/* Part navigation */}
            <div className="mb-8 flex items-center gap-2">
              {prevPart ? (
                <Link
                  href={`/lessons/${slug}/part-${prevPart}`}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Part {prevPart}
                </Link>
              ) : (
                <span />
              )}
              {nextPart ? (
                <Link
                  href={`/lessons/${slug}/part-${nextPart}`}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Part {nextPart}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span />
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

            {/* Bottom navigation: parts within lesson, lessons at boundaries */}
            <nav className="my-8 flex items-center gap-2 border-t pt-6">
              {prevPart ? (
                <Link
                  href={`/lessons/${slug}/part-${prevPart}`}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Part {prevPart}
                </Link>
              ) : prev ? (
                <Link
                  href={lessonHref(prev)}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {LESSON_META[prev].title}
                </Link>
              ) : (
                <span />
              )}
              {nextPart ? (
                <Link
                  href={`/lessons/${slug}/part-${nextPart}`}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Part {nextPart}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : next ? (
                <Link
                  href={lessonHref(next)}
                  className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {LESSON_META[next].title}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
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
