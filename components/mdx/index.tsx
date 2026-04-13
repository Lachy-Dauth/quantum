import { Math, InlineMath } from './Math'
import { Callout } from './Callout'
import { Theorem, Definition, Proof } from './TheoremBlocks'
import { WorkedExample } from './WorkedExample'
import { Problem } from './Problem'
import { SimulatorEmbed } from './SimulatorEmbed'
import { Figure } from './Figure'
import { CodeBlock } from './CodeBlock'
import { LessonNav } from './LessonNav'
import type { MDXComponents } from 'mdx/types'

export const mdxComponents: MDXComponents = {
  Math,
  InlineMath,
  Callout,
  Theorem,
  Definition,
  Proof,
  WorkedExample,
  Problem,
  SimulatorEmbed,
  Figure,
  CodeBlock,
  pre: CodeBlock,
  LessonNav,
}
