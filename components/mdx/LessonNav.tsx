interface LessonNavProps {
  prevSlug?: string | null
  prevTitle?: string | null
  nextSlug?: string | null
  nextTitle?: string | null
}

export function LessonNav({ prevSlug, prevTitle, nextSlug, nextTitle }: LessonNavProps) {
  return (
    <nav className="my-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      {prevSlug ? (
        <a href={`/lessons/${prevSlug}`} className="text-sm text-blue-600 hover:underline">
          &larr; {prevTitle ?? prevSlug}
        </a>
      ) : (
        <span />
      )}
      {nextSlug ? (
        <a
          href={`/lessons/${nextSlug}`}
          className="text-sm text-blue-600 hover:underline sm:text-right"
        >
          {nextTitle ?? nextSlug} &rarr;
        </a>
      ) : (
        <span />
      )}
    </nav>
  )
}
