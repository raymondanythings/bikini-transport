import { Box, Divider, Flex } from 'styled-system/jsx'
import { Button } from '@/ui-lib/components/Button'
import { Typography } from '@/ui-lib/components/Typography'
import { DepartureTimeBottomSheet } from './components/DepartureTimeBottomSheet'
import { TicketSelectionBottomSheet } from './components/TicketSelectionBottomSheet'

// TODO: Layout 변경 필요
export const HomePage = () => {
  return (
    <Flex direction="column" height="screen" backgroundColor="background.neutral" position="relative">
      <Box position="absolute" top={0} left={0}>
        <img src="/home-bg-sea.png" alt="background" />
        <img src="/home-character-spongebob.png" alt="spongebob" />
      </Box>
      <Box flex="1" overflowY="auto" p={5} zIndex={1}>
        <Box backgroundColor="background.normal" borderRadius="20px">
          <Box>
            출발지~도착지
            <Divider />
            <Typography variant="H2_Bold">2024.06.15 (토) 14:00 출발</Typography>
          </Box>
        </Box>
      </Box>
      <Box px={5} py={4} flexShrink={0} backgroundColor="background.normal" zIndex={1}>
        <Button fullWidth>버스표 조회</Button>
      </Box>
      <TicketSelectionBottomSheet />
      <DepartureTimeBottomSheet />
    </Flex>
  )
}
