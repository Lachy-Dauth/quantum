interface LessonNavProps {
  prevSlug?: string | null
  prevTitle?: string | null
  nextSlug?: string | null
  nextTitle?: string | null
}

export function LessonNav({ prevSlug, prevTitle, nextSlug, nextTitle }: LessonNavProps) {
  return (
    <nav className="my-8 flex items-center justify-between border-t pt-6">
      {prevSlug ? (
        <a href={`/lessons/${prevSlug}`} className="text-sm text-blue-600 hover:underline">
          &larr; {prevTitle ?? prevSlug}
        </a>
      ) : (
        <span />
      )}
      {nextSlug ? (
        <a href={`/lessons/${nextSlug}`} className="text-sm text-blue-600 hover:underline">
          {nextTitle ?? nextSlug} &rarr;
        </a>
      ) : (
        <span />
      )}
    </nav>
  )
}
