import { ark } from '@ark-ui/react';
import { css } from 'styled-system/css';
import { Box, Flex } from 'styled-system/jsx';
import { Header } from '@/layout/Header';
import { CouponButton } from '@/pages/HomePage/components/CouponButton';
import { Button } from '@/ui-lib/components/Button';
import { openRouteOptionsBottomSheet } from './components/RouteOptionsBottomSheet';
import { RouteSearchSection } from './components/RouteSearchSection';

export const HomePage = () => {
  return (
    <Flex direction="column" height="screen" backgroundColor="background.neutral" position="relative">
      <BackgroundImage />
      <Header>
        <Header.Left>
          <LogoImage />
        </Header.Left>
      </Header>

      <Flex direction="column" flex="1" overflowY="auto" pb="6" zIndex={1}>
        <Box flex="1" px={5} pb={5} pt="45%">
          <RouteSearchSection />
        </Box>

        <Box px="2.5" hidden={false}>
          <CouponButton />
        </Box>
      </Flex>

      <Box px={5} py={4} flexShrink={0} backgroundColor="background.normal" zIndex={1}>
        <Button fullWidth onClick={openRouteOptionsBottomSheet}>
          버스표 조회
        </Button>
      </Box>
    </Flex>
  );
};

const BackgroundImage = () => (
  <ark.img
    src="/home-bg-sea.png"
    alt="background"
    className={css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 'auto',
      objectFit: 'contain',
      pointerEvents: 'none',
    })}
  />
);

const LogoImage = () => (
  <ark.img
    src="/logo-horizontal.png"
    alt="logo"
    className={css({
      height: '32px',
      width: 'auto',
    })}
  />
);
