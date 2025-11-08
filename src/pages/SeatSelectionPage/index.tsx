import { Box, Flex } from 'styled-system/jsx'
import { LeftOutlined } from '@/ui-lib/components/Icon'
import { Header } from '../../layout/Header'
import { Text } from '../../ui-lib/components/Text'
import { Button } from '@/ui-lib/components/Button'

export const SeatSelectionPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Left>
          <button>
            <LeftOutlined />
          </button>
        </Header.Left>
        <Header.Center>
          <Text variant="H1_Bold">좌석 선택</Text>
        </Header.Center>
      </Header>
      <Box flex="1" overflowY="auto" p={5} backgroundColor="background.neutral">
        <Box height="2000px" border={'1px solid black'}>
          <div>대충 현재 구역</div>
          <div>대충 좌석들 나열</div>
        </Box>
      </Box>
      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth>선택 완료 1/3</Button>
      </Box>
    </Flex>
  )
}
