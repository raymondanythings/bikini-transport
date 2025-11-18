import { ark } from '@ark-ui/react'
import { Box, Flex } from 'styled-system/jsx'
import { Header } from '@/layout/Header'
import { Button } from '@/ui-lib/components/Button'
import { CloseOutlined, SuccessCircleFilled } from '@/ui-lib/components/Icon'
import { Typography } from '../../ui-lib/components/Typography'

export const PaymentSuccessPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Center>
          <Typography variant="H1_Bold">결제 완료</Typography>
        </Header.Center>
        <Header.Right>
          <ark.button>
            <CloseOutlined />
          </ark.button>
        </Header.Right>
      </Header>
      <Box flex="1" overflowY="auto" py="25vh">
        <Flex direction="column" alignItems="center" gap="20px">
          <SuccessCircleFilled />
          <Typography variant="H0_Bold" color="label.normal">
            결제가 완료되었어요
          </Typography>
        </Flex>
      </Box>
      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth>확인</Button>
      </Box>
    </Flex>
  )
}
