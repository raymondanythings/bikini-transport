import { ark } from '@ark-ui/react'
import { Box, styled } from 'styled-system/jsx'
import { Typography } from '@/ui-lib/components/Typography'
import { tokens } from '@/ui-lib/theme/tokens'

type SeatSize = 'small' | 'large'
type SeatStatus = 'available' | 'disabled' | 'selected'

const SEAT_SIZE: Record<SeatSize, number> = {
  small: 21,
  large: 62,
} as const

const SEAT_COLORS: Record<SeatStatus, { fill: string; stroke: string }> = {
  available: { fill: tokens.colors.static.white.value, stroke: tokens.colors.label.alternative.value },
  disabled: { fill: tokens.colors.background.alternative.value, stroke: '#CECECF' },
  selected: { fill: tokens.colors.primary.normal.value, stroke: '#1957c2' },
} as const

const SEAT_TEXT_COLORS: Record<SeatStatus, string> = {
  available: 'label.normal',
  disabled: 'label.disable',
  selected: 'label.inverse',
} as const

const Button = styled(ark.button)

interface SeatIconProps {
  size: SeatSize
  status: SeatStatus
}

interface SeatButtonProps extends SeatIconProps {
  seatNumber?: string
  onClick?: () => void
}

export const SeatButton = ({ size, status, seatNumber, onClick }: SeatButtonProps) => {
  const sizeValue = SEAT_SIZE[size]
  const textColor = SEAT_TEXT_COLORS[status]

  return (
    <Button
      position="relative"
      display="inline-block"
      width={sizeValue}
      height={sizeValue}
      onClick={onClick}
      disabled={status === 'disabled'}
      cursor={status === 'disabled' ? 'not-allowed' : 'pointer'}
      border="none"
      background="transparent"
      padding={0}
    >
      <SeatIcon size={size} status={status} />
      {seatNumber !== undefined && (
        <Box position="absolute" top="43%" left="48%" transform="translate(-50%, -50%)" pointerEvents="none">
          <Typography variant="B2_Regular" color={textColor}>
            {seatNumber}
          </Typography>
        </Box>
      )}
    </Button>
  )
}

const SeatIcon = ({ size, status }: SeatIconProps) => {
  const sizeValue = SEAT_SIZE[size]
  const { fill, stroke } = SEAT_COLORS[status]

  return (
    <svg width={sizeValue} height={sizeValue} viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.16129"
        y="-0.16129"
        width="13.6774"
        height="14.2608"
        transform="matrix(1 0 0 -1 2.9613 16.5051)"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.322581"
      />
      <path
        d="M3.22743 0.161133H1.45164C0.739013 0.161133 0.161316 0.738831 0.161316 1.45146V15.9676C0.161316 18.2836 2.03883 20.1611 4.35486 20.1611H15.9678C18.2838 20.1611 20.1613 18.2836 20.1613 15.9676V1.45146C20.1613 0.738831 19.5836 0.161133 18.871 0.161133H17.2932C16.5806 0.161133 16.0029 0.738831 16.0029 1.45146V14.1019C16.0029 15.1709 15.1364 16.0374 14.0674 16.0374H6.45324C5.3843 16.0374 4.51775 15.1709 4.51775 14.1019V1.45146C4.51775 0.738831 3.94005 0.161133 3.22743 0.161133Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.322581"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
