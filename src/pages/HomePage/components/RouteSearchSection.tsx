import { ark } from '@ark-ui/react';
import { css } from 'styled-system/css';
import { Box, HStack, VStack } from 'styled-system/jsx';
import { CalendarOutlined, SyncOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';
import { openDepartureTimeBottomSheet } from './DepartureTimeBottomSheet';
import { openStationBottomSheet } from './StationBottomSheet';

export const RouteSearchSection = () => {
  return (
    <Box as="section" pb={3} borderRadius="xl" backgroundColor="background.normal" position="relative">
      <SpongeBobAndPatrickImage />
      <Box pt={7} pb={4} px={5}>
        <HStack gap={4} justify="center" alignItems="center" flexDirection={{ base: 'column', xs: 'row' }}>
          <StationButton label="출발" value="비키니시티" placeholder="출발역 선택" onClick={openStationBottomSheet} />
          <SwapButton onClick={() => {}} />
          <StationButton label="도착" value="구-라군" placeholder="도착역 선택" onClick={openStationBottomSheet} />
        </HStack>
      </Box>
      <Box px={5} gap={4}>
        <DateButton
          label="가는날"
          value="October 27 09:00 AM"
          placeholder="날짜를 입력해주세요"
          onClick={openDepartureTimeBottomSheet}
        />
      </Box>
    </Box>
  );
};

const StationButton = ({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
}) => {
  return (
    <ark.button className={css({ w: 'full', cursor: 'pointer' })} onClick={onClick}>
      <VStack gap={1} w="full" alignItems="center">
        <Typography variant="B2_Medium" color="label.neutral">
          {label}
        </Typography>
        <Typography variant="H1_Bold" color={value ? 'label.normal' : 'label.disable'} textAlign="center">
          {value || placeholder}
        </Typography>
      </VStack>
    </ark.button>
  );
};

const DateButton = ({
  label,
  value,
  placeholder,
  onClick,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onClick?: () => void;
}) => {
  return (
    <ark.button className={css({ w: 'full', cursor: 'pointer' })} onClick={onClick}>
      <HStack
        gap={4}
        px={5}
        py={4}
        borderTopWidth="1px"
        borderTopStyle="solid"
        borderTopColor="line.neutral"
        flexWrap="wrap"
        w="full"
      >
        <Typography variant="B2_Medium" color="static.black">
          {label}
        </Typography>

        <Typography variant="B2_Bold" color={value ? 'label.normal' : 'label.disable'} flex={1} textAlign="left">
          {value || placeholder}
        </Typography>

        <CalendarOutlined />
      </HStack>
    </ark.button>
  );
};

const SwapButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <ark.button
      onClick={onClick}
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        w: 11,
        h: 11,
        p: 2.5,
        borderRadius: 25,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'line.neutral',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
        _hover: {
          backgroundColor: 'background.neutral',
        },
      })}
      data-testid="swap-button"
    >
      <SyncOutlined size={24} />
    </ark.button>
  );
};

const SpongeBobAndPatrickImage = () => (
  <ark.img
    src="/home-patrick-spongebob.png"
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
