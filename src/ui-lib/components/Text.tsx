import { forwardRef, type ElementType } from 'react'
import { cva, type RecipeVariantProps } from 'styled-system/css'
import { styled, type HTMLStyledProps } from 'styled-system/jsx'

/**
 * Text recipe variants
 * - H1, H2: Heading styles
 * - B1, B2: Body text styles
 * - C1, C2: Caption/small text styles
 */
export const textRecipe = cva({
  base: {
    color: 'label.normal',
    display: 'block',
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
  },
  variants: {
    variant: {
      H0_Bold: { textStyle: 'H0_Bold' },
      H1_Bold: { textStyle: 'H1_Bold' },
      H1_Medium: { textStyle: 'H1_Medium' },
      H2_Bold: { textStyle: 'H2_Bold' },
      H2_Medium: { textStyle: 'H2_Medium' },
      B1_Bold: { textStyle: 'B1_Bold' },
      B1_Medium: { textStyle: 'B1_Medium' },
      B1_Regular: { textStyle: 'B1_Regular' },
      B2_Bold: { textStyle: 'B2_Bold' },
      B2_Medium: { textStyle: 'B2_Medium' },
      B2_Regular: { textStyle: 'B2_Regular' },
      C1_Bold: { textStyle: 'C1_Bold' },
      C1_Medium: { textStyle: 'C1_Medium' },
      C2_Medium: { textStyle: 'C2_Medium' },
      C2_Regular: { textStyle: 'C2_Regular' },
    },
  },
  defaultVariants: {
    variant: 'B1_Regular',
  },
})

// Pre-created styled components for better performance
const StyledH1 = styled('h1', textRecipe)
const StyledH2 = styled('h2', textRecipe)
const StyledP = styled('p', textRecipe)
const StyledSpan = styled('span', textRecipe)

type TextVariantProps = RecipeVariantProps<typeof textRecipe>

/**
 * Semantic HTML tag options for Text component
 */
type TextTag = 'h1' | 'h2' | 'p' | 'span'

/**
 * Mapping of variant prefix to default HTML tag
 */
const VARIANT_TO_TAG_MAP: Record<string, TextTag> = {
  H0: 'h1',
  H1: 'h1',
  H2: 'h2',
  B1: 'p',
  B2: 'p',
  C1: 'span',
  C2: 'span',
}

/**
 * Mapping of HTML tag to styled component
 */
const TAG_TO_COMPONENT_MAP: Record<TextTag, ElementType> = {
  h1: StyledH1,
  h2: StyledH2,
  p: StyledP,
  span: StyledSpan,
}

export type TextProps = Omit<HTMLStyledProps<'p'>, 'as'> &
  TextVariantProps & {
    /**
     * Override the default HTML tag
     * @default Auto-selected based on variant (H1 → h1, B1 → p, C1 → span)
     */
    as?: TextTag
  }

/**
 * Extract variant prefix (e.g., "H1_Bold" → "H1")
 */
function getVariantPrefix(variant?: string): string {
  if (!variant) return 'B1'
  const prefix = variant.split('_')[0]
  return prefix || 'B1'
}

/**
 * Determine the HTML tag to use based on variant and as prop
 */
function resolveTag(variant?: string, as?: TextTag): TextTag {
  // Explicit 'as' prop takes priority
  if (as) return as

  // Otherwise, infer from variant prefix
  const prefix = getVariantPrefix(variant)
  return VARIANT_TO_TAG_MAP[prefix] || 'p'
}

const Text = forwardRef<HTMLElement, TextProps>((props, ref) => {
  const { variant, as, children, ...rest } = props

  const tag = resolveTag(variant, as)
  const Component = TAG_TO_COMPONENT_MAP[tag]

  return (
    <Component ref={ref} variant={variant} {...rest}>
      {children}
    </Component>
  )
})

Text.displayName = 'Text'

export { Text }
