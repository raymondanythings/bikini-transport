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
    <path d="M8 11.5L11 14.5L16 9.5" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    <path d="M8 11.5L11 14.5L16 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export const LeftOutlined = ({ size = 24, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M16.0002 20L8.00024 12L16.0002 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 18L6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const CircleOutlined = ({ size = 10, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <circle cx="5" cy="5" r="4" fill="white" stroke="currentColor" strokeWidth="2" />
  </svg>
)

export const ExclamationCircleFilled = ({ size = 36, color = 'primary.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M18 31.5C25.4558 31.5 31.5 25.4558 31.5 18C31.5 10.5442 25.4558 4.5 18 4.5C10.5442 4.5 4.5 10.5442 4.5 18C4.5 25.4558 10.5442 31.5 18 31.5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M18 22.5C17.175 22.5 16.5 23.175 16.5 24C16.5 24.825 17.175 25.5 18 25.5C18.825 25.5 19.5 24.825 19.5 24C19.5 23.175 18.825 22.5 18 22.5Z"
      fill="black"
    />
    <path d="M18 12V18" stroke="black" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const UpOutlined = ({ size = 16, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M13.3334 10.6663L8.00002 5.33301L2.66669 10.6663"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const DownOutlined = ({ size = 16, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M13.3334 5.33366L8.00002 10.667L2.66669 5.33366"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
