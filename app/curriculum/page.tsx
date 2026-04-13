import Link from 'next/link'
import { CANONICAL_ORDER, LESSON_META, lessonHref, canonicalPosition, isFreeLessonSlug } from '@/lib/lessons/data'
import { TRACK_COLORS } from '@/lib/tracks'
import { Badge } from '@/components/ui/Badge'
import { Clock, Lock, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Curriculum</h1>
        <p className="mt-2 text-muted-foreground">
          23 lessons across three interleaved tracks, from 2&times;2 matrices to Shor&apos;s algorithm. Follow the canonical order below for the recommended learning path.
        </p>
      </div>

      <div className="space-y-3">
        {CANONICAL_ORDER.map((slug) => {
          const meta = LESSON_META[slug]
          const position = canonicalPosition(slug)
          const isFree = isFreeLessonSlug(slug)
          const colors = TRACK_COLORS[meta.track]
          const href = lessonHref(slug)

          return (
            <div key={slug} className="group relative">
              {meta.hasContent ? (
                <Link
                  href={href}
                  className={cn(
                    'block rounded-lg border border-border p-4 transition-colors',
                    'hover:border-primary/40 hover:bg-muted/50',
                  )}
                >
                  <LessonRow
                    position={position}
                    meta={meta}
                    isFree={isFree}
                    colors={colors}
                  />
                </Link>
              ) : (
                <div className="block rounded-lg border border-border p-4 opacity-60">
                  <LessonRow
                    position={position}
                    meta={meta}
                    isFree={isFree}
                    colors={colors}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LessonRow({
  position,
  meta,
  isFree,
  colors,
}: {
  position: number
  meta: (typeof LESSON_META)[keyof typeof LESSON_META]
  isFree: boolean
  colors: (typeof TRACK_COLORS)[keyof typeof TRACK_COLORS]
}) {
  return (
    <div className="flex items-start gap-4">
      {/* Position number */}
      <div className={cn(
        'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
        colors.bg, colors.text,
      )}>
        {position}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-semibold text-foreground">{meta.title}</h2>
          <Badge track={meta.track} />
          {isFree && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
              Free
            </span>
          )}
          {!isFree && !meta.hasContent && (
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>

        {meta.subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">{meta.subtitle}</p>
        )}

        <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {meta.estimatedMinutes} min
          </span>
          {meta.totalParts > 1 && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {meta.totalParts} parts
            </span>
          )}
          {!meta.hasContent && (
            <span className="italic">Coming soon</span>
          )}
        </div>
      </div>
    </div>
  )
}
