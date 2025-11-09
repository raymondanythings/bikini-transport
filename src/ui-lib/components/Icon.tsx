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

export const CloseCircleFilled = ({ size = 24, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.10004 12.0001C2.10004 6.53248 6.5324 2.1001 12 2.1001C17.4676 2.1001 21.9 6.53248 21.9 12.0001C21.9 17.4677 17.4676 21.9001 12 21.9001C6.5324 21.9001 2.10004 17.4677 2.10004 12.0001ZM9.1364 7.86373C8.78493 7.51225 8.21508 7.51225 7.86361 7.86373C7.51214 8.2152 7.51214 8.78505 7.86361 9.13652L10.7272 12.0001L7.86361 14.8637C7.51214 15.2152 7.51214 15.785 7.86361 16.1365C8.21508 16.488 8.78493 16.488 9.1364 16.1365L12 13.2729L14.8636 16.1365C15.2151 16.488 15.7849 16.488 16.1364 16.1365C16.4878 15.785 16.4878 15.2152 16.1364 14.8637L13.2728 12.0001L16.1364 9.13652C16.4878 8.78505 16.4878 8.2152 16.1364 7.86373C15.7849 7.51225 15.2151 7.51225 14.8636 7.86373L12 10.7273L9.1364 7.86373Z"
      fill="#B0B0B0"
    />
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

export const CircleFilled = ({ size = 2, color = 'label.alternative' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 2 2"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <circle cx="1" cy="1" r="1" fill="currentColor" />
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

// 111111
export const SearchOutlined = ({ size = 24, color = 'label.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91015 14.0899 4 10.5 4C6.91015 4 4 6.91015 4 10.5C4 14.0899 6.91015 17 10.5 17Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M19.4697 20.5303C19.7626 20.8232 20.2374 20.8232 20.5303 20.5303C20.8232 20.2374 20.8232 19.7626 20.5303 19.4697L20 20L19.4697 20.5303ZM15 15L14.4697 15.5303L19.4697 20.5303L20 20L20.5303 19.4697L15.5303 14.4697L15 15Z"
      fill="currentColor"
    />
  </svg>
)
