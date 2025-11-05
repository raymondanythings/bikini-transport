import { ark } from '@ark-ui/react'
import { forwardRef } from 'react'
import { cva, type RecipeVariantProps } from 'styled-system/css'
import { styled, type HTMLStyledProps } from 'styled-system/jsx'

type ButtonVariantProps = RecipeVariantProps<typeof buttonRecipe>

const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    pos: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    w: 'fit-content',

    _active: {
      transform: 'scale(0.98)',
    },
    _hover: {
      transform: 'scale(0.99)',
    },

    _disabled: {
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },

    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'primary.normal',
      outlineOffset: '2px',
    },

    _loading: {
      cursor: 'wait',
      pointerEvents: 'none',
    },
  },

  variants: {
    color: {
      primary: {
        bgColor: 'primary.normal',
        color: 'label.normal',
        _active: {
          bgColor: 'primary.strong',
        },
        _hover: {
          bgColor: 'primary.strong',
        },
        _disabled: {
          bgColor: 'background.alternative',
          color: 'label.disable',
        },
      },

      secondary: {
        bgColor: 'background.normal',
        color: 'label.normal',
        border: '1px solid',
        borderColor: 'line.normal',

        _active: {
          bgColor: 'background.neutral',
          borderColor: 'line.neutral',
        },
        _hover: {
          bgColor: 'background.neutral',
          borderColor: 'line.neutral',
        },
        _disabled: {
          color: 'label.disable',
          borderColor: 'line.alternative',
        },
      },
    },

    size: {
      small: {
        px: 3,
        py: 1,
        textStyle: 'B2_Medium',
        rounded: 'md',
        gap: 1,
      },
      medium: {
        px: 4,
        py: 3.5,
        textStyle: 'B2_Medium',
        rounded: 'lg',
        gap: 2,
      },
      large: {
        px: 7,
        py: 3,
        textStyle: 'H2_Bold',
        rounded: 'xl',
        gap: 2,
      },
    },

    fullWidth: {
      true: {
        w: 'full',
      },
    },

    loading: {
      true: {
        cursor: 'wait',
        pointerEvents: 'none',
      },
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'large',
    fullWidth: false,
    loading: false,
  },
})

const LoadingSpinner = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    style={{
      animation: 'spin 1s linear infinite',
    }}
  >
    <style>
      {`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="32"
      style={{
        animation: 'spin 1s linear infinite',
        opacity: 0.25,
      }}
    />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

type BaseButtonProps = ButtonVariantProps & {
  /**
   * 버튼의 로딩 상태
   */
  loading?: boolean
  /**
   * 로딩 상태일 때 표시할 텍스트
   */
  loadingText?: string
  /**
   * 버튼과 함께 표시할 아이콘
   */
  icon?: React.ReactNode
  /**
   * 아이콘의 위치
   */
  iconPosition?: 'start' | 'end'
}

type ButtonProps = {
  // 기존 props
  ref?: React.Ref<HTMLButtonElement>
} & BaseButtonProps &
  HTMLStyledProps<'button'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    color = 'primary',
    size = 'large',
    fullWidth = false,
    loading = false,
    loadingText,
    icon,
    iconPosition = 'start',
    disabled,
    ...rest
  } = props

  const ButtonComponent = styled(ark.button, buttonRecipe)

  const spinnerSize = {
    small: 12,
    medium: 14,
    large: 16,
  }[size]

  const isDisabled = disabled || loading
  const displayIcon = loading ? <LoadingSpinner size={spinnerSize} /> : icon ? icon : null

  return (
    <ButtonComponent
      ref={ref}
      color={color}
      size={size}
      fullWidth={fullWidth}
      loading={loading}
      disabled={isDisabled}
      {...rest}
    >
      {iconPosition === 'start' && displayIcon}
      {loading ? loadingText || children : children}
      {iconPosition === 'end' && displayIcon}
    </ButtonComponent>
  )
})

Button.displayName = 'Button'
