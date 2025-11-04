import { ark } from '@ark-ui/react'
import { forwardRef } from 'react'
import { cva, type RecipeVariantProps } from 'styled-system/css'
import { styled, type HTMLStyledProps } from 'styled-system/jsx'

type TagVariantProps = RecipeVariantProps<typeof tagRecipe>

const tagRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    w: 'fit-content',
    minW: '43px',
    px: 1,
    py: '3px',
    rounded: 'full',

    fontWeight: 'bold',
    fontSize: '10px',
    lineHeight: 1.4,
    letterSpacing: '-0.025em',

    color: 'label.normal',
  },

  variants: {
    color: {
      pink: {
        bgColor: '#FAAB9E',
      },
      green: {
        bgColor: '#B7DCCA',
      },
      red: {
        bgColor: '#FF534F',
      },
      white: {
        bgColor: 'background.normal',
        border: '1px solid',
        borderColor: 'line.normal',
      },
    },
  },

  defaultVariants: {
    color: 'white',
  },
})

type BaseTagProps = TagVariantProps

type TagProps = {
  ref?: React.Ref<HTMLSpanElement>
} & BaseTagProps &
  HTMLStyledProps<'span'>

export const Tag = forwardRef<HTMLSpanElement, TagProps>((props, ref) => {
  const { children, color = 'pink', ...rest } = props

  const TagComponent = styled(ark.span, tagRecipe)

  return (
    <TagComponent ref={ref} color={color} {...rest}>
      {children}
    </TagComponent>
  )
})

Tag.displayName = 'Tag'
