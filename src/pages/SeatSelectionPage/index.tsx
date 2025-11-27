import { ark } from '@ark-ui/react';
import { Box, Flex, HStack, Spacer } from 'styled-system/jsx';
import { Header } from '@/layout/Header';
import { Button } from '@/ui-lib/components/Button';
import { LeftOutlined } from '@/ui-lib/components/Icon';
import { ProgressBar } from '@/ui-lib/components/ProgressBar';
import { Typography } from '@/ui-lib/components/Typography';
import { BusInfoSection } from './components/BusInfoSection';
import { SeatSection } from './components/SeatSection';

export const SeatSelectionPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Left>
          <ark.button onClick={() => {}}>
            <LeftOutlined />
          </ark.button>
        </Header.Left>
        <Header.Center>
          <Typography variant="H1_Bold">좌석 선택</Typography>
        </Header.Center>
      </Header>

      <ProgressBar value={0.3} />

      <Box flex="1" overflowY="auto" p={5} backgroundColor="background.neutral">
        <BusInfoSection />
        <Spacer height="4" />
        <SeatSection />
      </Box>

      <Box px={5} py={4} flexShrink={0}>
        <HStack>
          <Button color="secondary" fullWidth onClick={() => {}}>
            이전
          </Button>
          <Button fullWidth onClick={() => {}}>
            다음
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};
