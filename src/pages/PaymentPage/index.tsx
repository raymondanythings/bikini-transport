import { Box, Flex } from 'styled-system/jsx'
import { Button } from '@/ui-lib/components/Button'
import { CloseOutlined } from '@/ui-lib/components/Icon'
import { Header } from '../../layout/Header'
import { Typography } from '../../ui-lib/components/Typography'

export const PaymentPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Left>
          <button>
            <CloseOutlined />
          </button>
        </Header.Left>
        <Header.Center>
          <Typography variant="H1_Bold">결제</Typography>
        </Header.Center>
      </Header>
      <Box flex="1" overflowY="auto" p={5}>
        <Box height="2000px" border={'1px solid black'}>
          카드카드
        </Box>
      </Box>
      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth>확인</Button>
      </Box>
    </Flex>
  )
}
