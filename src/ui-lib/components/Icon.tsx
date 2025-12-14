import { css } from 'styled-system/css';
import { type ColorToken, token } from 'styled-system/tokens';

interface IconProps {
  size?: number;
  color?: ColorToken;
  innerColor?: ColorToken;
}

export const CheckCircleFilled = ({ size = 24, color = 'primary.normal', innerColor = 'static.white' }: IconProps) => (
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
      stroke={token(`colors.${innerColor}`)}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
);

export const RightOutlined = ({ size = 24, color = 'static.lightGray' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M7.99976 20.0005L15.9998 12.0005L7.99976 4.00049"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SwapRightOutlined = ({ size = 24, color = 'label.normal' }: IconProps) => (
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
);

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
);

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
);

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
);

export const CircleOutlined = ({ size = 24, color = 'label.normal' }: IconProps) => (
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
);

export const CircleFilled = ({ size = 24, color = 'label.alternative' }: IconProps) => (
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
);

export const ExclamationCircleFilled = ({
  size = 24,
  color = 'primary.normal',
  innerColor = 'static.white',
}: IconProps) => (
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
      fill={token(`colors.${innerColor}`)}
    />
    <path d="M18 12V18" stroke={token(`colors.${innerColor}`)} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DownOutlined = ({ size = 24, color = 'label.normal' }: IconProps) => (
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
);

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
);

export const CalendarOutlined = ({ size = 24, color = 'label.alternative' }: IconProps) => (
  <svg
    data-test-id="calendar-outlined"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path d="M20 7H4V20H20V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 7H4V12H20V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SyncOutlined = ({ size = 24, color = 'label.neutral' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path
      d="M19.2654 9.297C19.1209 8.9088 18.6891 8.71122 18.3009 8.85569C17.9127 9.00017 17.7151 9.43199 17.8596 9.82019L18.5625 9.55859L19.2654 9.297ZM19 11.9999H18.25C18.25 15.4517 15.4518 18.2499 12 18.2499V18.9999V19.7499C16.2802 19.7499 19.75 16.2802 19.75 11.9999H19ZM18.5625 9.55859L17.8596 9.82019C18.1118 10.4979 18.25 11.2319 18.25 11.9999H19H19.75C19.75 11.0506 19.579 10.1396 19.2654 9.297L18.5625 9.55859Z"
      fill="currentColor"
    />
    <path
      d="M5.70354 16.5194C5.94533 16.8558 6.41397 16.9324 6.7503 16.6906C7.08662 16.4488 7.16325 15.9802 6.92146 15.6438L6.3125 16.0816L5.70354 16.5194ZM5 12H5.75C5.75 8.54822 8.54822 5.75 12 5.75V5V4.25C7.71979 4.25 4.25 7.71979 4.25 12H5ZM6.3125 16.0816L6.92146 15.6438C6.18408 14.6182 5.75 13.3609 5.75 12H5H4.25C4.25 13.6854 4.78885 15.2471 5.70354 16.5194L6.3125 16.0816Z"
      fill="currentColor"
    />
    <path
      d="M14.7331 4.72265C14.8821 4.87752 14.8821 5.12248 14.7331 5.27735L11.9382 8.18188C11.6886 8.44135 11.25 8.26462 11.25 7.90453L11.25 2.09547C11.25 1.73538 11.6886 1.55865 11.9382 1.81812L14.7331 4.72265Z"
      fill="currentColor"
    />
    <path
      d="M9.26688 19.2773C9.11785 19.1225 9.11785 18.8775 9.26688 18.7227L12.0618 15.8181C12.3114 15.5586 12.75 15.7354 12.75 16.0955L12.75 21.9045C12.75 22.2646 12.3114 22.4414 12.0618 22.1819L9.26688 19.2773Z"
      fill="currentColor"
    />
  </svg>
);

export const SuccessCircleFilled = ({ size = 24, color = 'primary.normal' }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <circle cx="45" cy="45" r="45" fill="currentColor" />
    <path d="M25 43L40 58L65 33" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CaretUpOutlined = ({ color = 'static.darkGray' }: Omit<IconProps, 'size'>) => (
  <svg
    width="15"
    height="13"
    viewBox="0 0 15 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={css({ color })}
  >
    <path d="M7.5 0L0 13H15L7.5 0Z" fill="currentColor" />
  </svg>
);
