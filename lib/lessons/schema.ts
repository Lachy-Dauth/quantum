import { z } from 'zod'

export const lessonFrontmatterSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  track: z.enum(['math', 'physics', 'computing']),
  trackPosition: z.number().int().positive(),
  canonicalOrder: z.number().int().positive(),
  slug: z.string(),
  part: z.number().int().positive().optional(),
  totalParts: z.number().int().positive().default(1),
  prerequisites: z.array(z.string()).default([]),
  estimatedMinutes: z.number().int().positive(),
  objectives: z.array(z.string()),
  keywords: z.array(z.string()).optional(),
})

export type LessonFrontmatter = z.infer<typeof lessonFrontmatterSchema>
