import { ark } from '@ark-ui/react'
import { Box, Divider, Flex, HStack, Spacer, VStack } from 'styled-system/jsx'
import { Button } from '@/ui-lib/components/Button'
import { CaretUpOutlined, LeftOutlined, SwapRightOutlined } from '@/ui-lib/components/Icon'
import { Header } from '../../layout/Header'
import { Typography } from '../../ui-lib/components/Typography'
import { SeatButton } from './components/SeatButton'

export const SeatSelectionPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Left>
          <ark.button>
            <LeftOutlined />
          </ark.button>
        </Header.Left>
        <Header.Center>
          <Typography variant="H1_Bold">좌석 선택</Typography>
        </Header.Center>
      </Header>
      <Box flex="1" overflowY="auto" p={5} backgroundColor="background.neutral">
        <VStack gap="3" p="5" backgroundColor="background.normal" borderRadius="xl">
          <HStack gap="4">
            <Typography variant="B1_Bold" color="label.normal">
              첫번째 환승
            </Typography>
            <SwapRightOutlined />
            <Typography variant="B1_Bold" color="label.normal">
              첫번째 환승
            </Typography>
          </HStack>
          <HStack>
            <HStack gap="1">
              <Typography variant="B2_Medium" color="label.normal">
                전체 20석
              </Typography>
              <Divider orientation="vertical" height="2.5" color="line.normal" />
              <Typography variant="B2_Medium" color="label.normal">
                잔여 19석
              </Typography>
            </HStack>
          </HStack>
        </VStack>
        <Spacer height="4" />
        <HStack gap="5" justifyContent="center">
          <HStack gap="1">
            <SeatButton size="small" status="available" />
            <Typography>선택 가능</Typography>
          </HStack>
          <HStack gap="1">
            <SeatButton size="small" status="disabled" />
            <Typography>선택 불가</Typography>
          </HStack>
        </HStack>
        <Spacer height="6" />
        <VStack gap="2">
          {/* Row 1 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr 0.8fr 1fr 1fr" gap="2" alignItems="center">
            <SeatButton size="large" status="available" seatNumber="1A" />
            <SeatButton size="large" status="available" seatNumber="1B" />
            <Box width="15px" />
            <SeatButton size="large" status="available" seatNumber="1C" />
            <SeatButton size="large" status="available" seatNumber="1D" />
          </Box>

          {/* Row 2 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr 0.8fr 1fr 1fr" gap="2" alignItems="center">
            <SeatButton size="large" status="available" seatNumber="2A" />
            <SeatButton size="large" status="disabled" seatNumber="2B" />
            <Box display="flex" justifyContent="center" alignItems="center">
              <CaretUpOutlined />
            </Box>
            <SeatButton size="large" status="available" seatNumber="2C" />
            <SeatButton size="large" status="available" seatNumber="2D" />
          </Box>

          {/* Row 3 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr 0.8fr 1fr 1fr" gap="2" alignItems="center">
            <SeatButton size="large" status="available" seatNumber="3A" />
            <SeatButton size="large" status="available" seatNumber="3B" />
            <Box display="flex" justifyContent="center" alignItems="center">
              <CaretUpOutlined />
            </Box>
            <SeatButton size="large" status="selected" seatNumber="3C" />
            <SeatButton size="large" status="available" seatNumber="3D" />
          </Box>

          {/* Row 4 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr 0.8fr 1fr 1fr" gap="2" alignItems="center">
            <SeatButton size="large" status="available" seatNumber="4A" />
            <SeatButton size="large" status="available" seatNumber="4B" />
            <Box display="flex" justifyContent="center" alignItems="center">
              <CaretUpOutlined />
            </Box>
            <SeatButton size="large" status="available" seatNumber="4C" />
            <SeatButton size="large" status="available" seatNumber="4D" />
          </Box>

          {/* Row 5 */}
          <Box display="grid" gridTemplateColumns="1fr 1fr 0.8fr 1fr 1fr" gap="2" alignItems="center">
            <SeatButton size="large" status="available" seatNumber="5A" />
            <SeatButton size="large" status="available" seatNumber="5B" />
            <Box display="flex" justifyContent="center" alignItems="center">
              <CaretUpOutlined />
            </Box>
            <SeatButton size="large" status="available" seatNumber="5C" />
            <SeatButton size="large" status="available" seatNumber="5D" />
          </Box>
        </VStack>
      </Box>
      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth>선택 완료 1/3</Button>
      </Box>
    </Flex>
  )
}
