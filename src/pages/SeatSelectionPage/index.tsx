import { ark } from '@ark-ui/react';
import { Box, Flex, Spacer } from 'styled-system/jsx';
import { Header } from '@/layout/Header';
import { Button } from '@/ui-lib/components/Button';
import { LeftOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';
import { BusInfoSection } from './components/BusInfoSection';
import { SeatSection } from './components/SeatSection';

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
        <BusInfoSection />
        <Spacer height="4" />
        <SeatSection />
      </Box>

      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth>선택 완료 1/3</Button>
      </Box>
    </Flex>
  );
};
