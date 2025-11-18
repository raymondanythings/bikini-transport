import { ark } from '@ark-ui/react';
import { forwardRef } from 'react';
import { css } from 'styled-system/css';
import { Box, Flex, HStack, VStack } from 'styled-system/jsx';
import { Header } from '@/layout/Header';
import { Button } from '@/ui-lib/components/Button';
import { CalendarOutlined, SyncOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';
import { DepartureTimeBottomSheet } from './components/DepartureTimeBottomSheet';
import { StationSearchBottomSheet } from './components/StationSearchBottomSheet';
import { TicketSelectionBottomSheet } from './components/TicketSelectionBottomSheet';

export const HomePage = () => {
  return (
    <Flex direction="column" height="screen" backgroundColor="background.neutral" position="relative">
      <BackgroundImage />
      <Header>
        <Header.Left>
          <ark.img
            src="/logo-horizontal.png"
            alt="logo"
            className={css({
              height: '32px',
              width: 'auto',
            })}
          />
        </Header.Left>
      </Header>

      <Box flex="1" overflowY="auto" px={5} pb={5} pt="45%" zIndex={1}>
        <Box pb={3} borderRadius="xl" backgroundColor="background.normal" position="relative">
          <SpongeBobImage />
          <Box pt={7} pb={4} px={5}>
            <HStack gap={4} justify="center" alignItems="center" flexDirection={{ base: 'column', xs: 'row' }}>
              <VStack as="button">
                <Typography variant="SpongeBob_Body" color="label.neutral">
                  Departure
                </Typography>

                <Typography variant="SpongeBob_Headline" color="static.black" textAlign="center">
                  JINGJING BILA
                </Typography>
              </VStack>

              <ChangeButton />

              <VStack as="button">
                <Typography variant="SpongeBob_Body" color="label.neutral">
                  Arrival
                </Typography>
                <Typography variant="SpongeBob_Headline" color="static.black" textAlign="center">
                  BIKINI BOTTOM
                </Typography>
              </VStack>
            </HStack>
          </Box>
          <Box px={5} gap={4}>
            <HStack
              as="button"
              gap={4}
              px={5}
              py={4}
              borderTopWidth="1px"
              borderTopStyle="solid"
              borderTopColor="line.neutral"
              flexWrap="wrap"
              w="full"
            >
              <Typography variant="SpongeBob_Body" color="label.normal">
                DATE
              </Typography>

              <Typography variant="SpongeBob_Body" color="label.normal" flex={1} textAlign="left">
                October 27 09:00 AM
              </Typography>

              <CalendarOutlined />
            </HStack>
          </Box>
        </Box>
      </Box>
      <Box px={5} py={4} flexShrink={0} backgroundColor="background.normal" zIndex={1}>
        <Button fullWidth>버스표 조회</Button>
      </Box>
      <TicketSelectionBottomSheet />
      <DepartureTimeBottomSheet />
      <StationSearchBottomSheet />
    </Flex>
  );
};

const ChangeButton = forwardRef<HTMLButtonElement>((props, ref) => {
  return (
    <ark.button
      ref={ref}
      aria-label="출발지와 도착지 바꾸기"
      className={css({
        w: 11,
        h: 11,
        p: 2.5,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'line.neutral',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
        _hover: {
          backgroundColor: 'background.neutral',
        },
      })}
      {...props}
    >
      <SyncOutlined size={24} />
    </ark.button>
  );
});

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

const SpongeBobImage = () => (
  <ark.img
    src="/home-character-spongebob.png"
    alt=""
    className={css({
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, 18%)',
      width: '70%',
      maxWidth: '300px',
      height: 'auto',
      objectFit: 'contain',
      pointerEvents: 'none',
      zIndex: 2,
    })}
  />
);
