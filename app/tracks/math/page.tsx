import Link from 'next/link'
import { lessonsForTrack, lessonHref, isFreeLessonSlug } from '@/lib/lessons/data'
import { TRACK_COLORS } from '@/lib/tracks'
import { Clock, Lock, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const track = 'math' as const
const lessons = lessonsForTrack(track)
const colors = TRACK_COLORS[track]

export default function MathTrackPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <div className={cn('mb-4 h-1 w-16 rounded-full', colors.accent)} />
        <h1 className="text-3xl font-bold text-foreground">Mathematics Track</h1>
        <p className="mt-2 text-muted-foreground">
          Six lessons building the linear algebra and probability theory that underpin quantum mechanics.
          From complex numbers to the Born rule.
        </p>
      </div>

      <div className="space-y-3">
        {lessons.map((meta, i) => {
          const isFree = isFreeLessonSlug(meta.slug)
          const href = lessonHref(meta.slug)

          const card = (
            <div className="flex items-start gap-4">
              <div className={cn(
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold',
                colors.bg, colors.text,
              )}>
                A{i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-foreground">{meta.title}</h2>
                  {isFree && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
                      Free
                    </span>
                  )}
                  {!isFree && !meta.hasContent && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                </div>
                {meta.subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{meta.subtitle}</p>}
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{meta.estimatedMinutes} min</span>
                  {meta.totalParts > 1 && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{meta.totalParts} parts</span>}
                  {!meta.hasContent && <span className="italic">Coming soon</span>}
                </div>
              </div>
            </div>
          )

          return meta.hasContent ? (
            <Link key={meta.slug} href={href} className="block rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/50">
              {card}
            </Link>
          ) : (
            <div key={meta.slug} className="block rounded-lg border border-border p-4 opacity-60">
              {card}
            </div>
          )
        })}
      </div>
    </div>
  )
}
