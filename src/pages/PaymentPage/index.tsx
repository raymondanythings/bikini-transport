import { ark } from '@ark-ui/react';
import { Box, Flex } from 'styled-system/jsx';
import { Header } from '@/layout/Header';
import { Button } from '@/ui-lib/components/Button';
import { CloseOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';
import { openPaymentConfirmBottomSheet } from './components/PaymentConfirmBottomSheet';
import { PaymentDetailSection } from './components/PaymentDetailSection';

export const PaymentPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Left>
          <ark.button onClick={() => {}}>
            <CloseOutlined />
          </ark.button>
        </Header.Left>
        <Header.Center>
          <Typography variant="H1_Bold">결제</Typography>
        </Header.Center>
      </Header>

      <Box flex="1" overflowY="auto" pt="5" pb="2.5" px="5">
        <PaymentDetailSection />
      </Box>

      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth onClick={openPaymentConfirmBottomSheet}>
          결제하기
        </Button>
      </Box>
    </Flex>
  );
};
