import { compileMDX } from 'next-mdx-remote/rsc'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { mdxComponents } from '@/components/mdx'
import { lessonFrontmatterSchema, type LessonFrontmatter } from './schema'
import { katexMacros } from '@/lib/katex-macros'

export async function renderLesson(source: string) {
  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [
          [rehypeKatex, { macros: katexMacros, strict: false, throwOnError: false }],
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ],
      },
    },
    components: mdxComponents,
  })

  const validatedFrontmatter = lessonFrontmatterSchema.parse(frontmatter) as LessonFrontmatter

  return { content, frontmatter: validatedFrontmatter }
}
