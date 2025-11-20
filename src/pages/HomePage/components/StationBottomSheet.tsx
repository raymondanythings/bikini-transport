import { ark } from '@ark-ui/react';
import { overlay } from 'overlay-kit';
import { useState } from 'react';
import { css } from 'styled-system/css';
import { Box, Divider, Flex, Spacer } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { SearchOutlined } from '@/ui-lib/components/Icon';
import { Input } from '@/ui-lib/components/Input';
import { Typography } from '@/ui-lib/components/Typography';

interface StationBottomSheetProps {
  isOpen: boolean;
  close: () => void;
}

export const openStationBottomSheet = () => {
  return overlay.open(({ isOpen, close }) => <StationBottomSheet isOpen={isOpen} close={close} />);
};

export const StationBottomSheet = ({ isOpen, close }: StationBottomSheetProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BottomSheet
      open={isOpen}
      onDimmerClick={close}
      header={
        <Flex>
          <BottomSheet.Header>정류장 검색</BottomSheet.Header>
        </Flex>
      }
    >
      <Box pt={2} px={5} pb={5} overflow="hidden">
        <Input
          placeholder="버스 정류장을 검색해주세요"
          icon={<SearchOutlined />}
          allowClear
          value={searchQuery}
          onChange={event => {
            setSearchQuery(event.target.value);
          }}
        />

        <Spacer height={2} />

        <Flex direction="column" as="ul" height="360px" overflowY="auto">
          <StationListItem name="뉴 켈프 시티" />
          <Divider color="line.alternative" />

          <StationListItem name="글러브월드" />
          <Divider color="line.alternative" />

          <StationListItem name="비키니시티" />
          <Divider color="line.alternative" />

          <StationListItem name="플로터스 묘지" />
          <Divider color="line.alternative" />

          <StationListItem name="버블타운" />
          <Divider color="line.alternative" />

          <StationListItem name="메롱시티" />
          <Divider color="line.alternative" />

          <StationListItem name="비키니 환초" />
          <Divider color="line.alternative" />
        </Flex>
      </Box>
    </BottomSheet>
  );
};

const StationListItem = ({ name, onClick }: { name: string; onClick?: () => void }) => {
  return (
    <Box as="li">
      <ark.button
        onClick={onClick}
        className={css({
          w: 'full',
          textAlign: 'left',
          p: 4,
          cursor: 'pointer',
        })}
      >
        <Typography variant="B1_Medium" color="label.normal">
          {name}
        </Typography>
      </ark.button>
      <Divider color="line.alternative" />
    </Box>
  );
};
