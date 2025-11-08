import { ark } from '@ark-ui/react'
import { Box, Flex } from 'styled-system/jsx'
import { Header } from '@/layout/Header'
import { Button } from '@/ui-lib/components/Button'
import { CloseOutlined } from '@/ui-lib/components/Icon'
import { Typography } from '../../ui-lib/components/Typography'

export const PaymentSuccessPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Center>
          <Typography variant="H1_Bold">결재 완료</Typography>
        </Header.Center>
        <Header.Right>
          <ark.button>
            <CloseOutlined />
          </ark.button>
        </Header.Right>
      </Header>
      <Box flex="1" overflowY="auto" py="25vh">
        <Flex direction="column" alignItems="center" gap="20px">
          <PaymentSuccessIcon />
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

const PaymentSuccessIcon = () => (
  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="45" r="45" fill="#FFEB60" />
    <path d="M25 43L40 58L65 33" stroke="#171717" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
