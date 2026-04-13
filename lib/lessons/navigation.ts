import { CANONICAL_ORDER } from './data'

export function getPrevNextLessons(slug: string) {
  const index = CANONICAL_ORDER.indexOf(slug as (typeof CANONICAL_ORDER)[number])

  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? CANONICAL_ORDER[index - 1]! : null,
    next: index < CANONICAL_ORDER.length - 1 ? CANONICAL_ORDER[index + 1]! : null,
  }
}
