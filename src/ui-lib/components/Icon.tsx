import { css } from 'styled-system/css'
import type { ColorToken } from 'styled-system/tokens'

interface IconProps {
  size?: number
  color?: ColorToken
}

export const CheckCircleFilled = ({ size = 24, color = 'primary.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <circle cx="12" cy="12" r="8.5" fill="currentColor" stroke="currentColor" />
    <path
      d="M8 11.5L11 14.5L16 9.5"
      stroke="#171717"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)

export const CheckCircleOutlined = ({ size = 24, color = 'line.neutral' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" />
    <path d="M8 11.5L11 14.5L16 9.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
)

export const CloseOutlined = ({ size = 24, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path d="M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    <path d="M18 18L6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  </svg>
)

export const SwapRightOutlined = ({ size = 16, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path d="M8 6L14 10H8V6Z" fill="currentColor" />
    <path d="M8 9V10H2V9H8Z" fill="currentColor" />
  </svg>
)
