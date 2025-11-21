import { useState } from 'react';
import { Box, HStack, VStack } from 'styled-system/jsx';
import { CaretUpOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';
import { SeatCheckItem, SeatIcon } from './SeatCheckItem';

export const SeatSection = () => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>('3C');

  const handleSeatChange = (seatNumber: string, checked: boolean) => {
    setSelectedSeat(checked ? seatNumber : null);
  };

  return (
    <VStack gap="6">
      <SeatLegend />
      <SeatGrid selectedSeat={selectedSeat} onSeatChange={handleSeatChange} />
    </VStack>
  );
};

const SeatLegend = () => {
  return (
    <HStack gap="5" justifyContent="center">
      <HStack gap="1">
        <SeatIcon size="small" />
        <Typography>선택 가능</Typography>
      </HStack>
      <HStack gap="1">
        <SeatIcon size="small" disabled />
        <Typography>선택 불가</Typography>
      </HStack>
    </HStack>
  );
};

const SeatGrid = ({
  selectedSeat,
  onSeatChange,
}: {
  selectedSeat: string | null;
  onSeatChange: (seatNumber: string, checked: boolean) => void;
}) => {
  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr 0.8fr 1fr 1fr" gap="2" alignItems="center">
      {/* Row 1 */}
      <SeatCheckItem
        size="large"
        seatNumber="1A"
        checked={selectedSeat === '1A'}
        onCheckedChange={checked => onSeatChange('1A', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="1B"
        checked={selectedSeat === '1B'}
        onCheckedChange={checked => onSeatChange('1B', checked)}
      />
      <Aisle />
      <SeatCheckItem
        size="large"
        seatNumber="1C"
        checked={selectedSeat === '1C'}
        onCheckedChange={checked => onSeatChange('1C', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="1D"
        checked={selectedSeat === '1D'}
        onCheckedChange={checked => onSeatChange('1D', checked)}
      />

      {/* Row 2 */}
      <SeatCheckItem
        size="large"
        seatNumber="2A"
        checked={selectedSeat === '2A'}
        onCheckedChange={checked => onSeatChange('2A', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="2B"
        checked={selectedSeat === '2B'}
        onCheckedChange={checked => onSeatChange('2B', checked)}
      />
      <Aisle withIcon />
      <SeatCheckItem
        disabled
        size="large"
        seatNumber="2C"
        checked={selectedSeat === '2C'}
        onCheckedChange={checked => onSeatChange('2C', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="2D"
        checked={selectedSeat === '2D'}
        onCheckedChange={checked => onSeatChange('2D', checked)}
      />

      {/* Row 3 */}
      <SeatCheckItem
        size="large"
        seatNumber="3A"
        checked={selectedSeat === '3A'}
        onCheckedChange={checked => onSeatChange('3A', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="3B"
        checked={selectedSeat === '3B'}
        onCheckedChange={checked => onSeatChange('3B', checked)}
      />
      <Aisle withIcon />
      <SeatCheckItem
        size="large"
        seatNumber="3C"
        checked={selectedSeat === '3C'}
        onCheckedChange={checked => onSeatChange('3C', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="3D"
        checked={selectedSeat === '3D'}
        onCheckedChange={checked => onSeatChange('3D', checked)}
      />

      {/* Row 4 */}
      <SeatCheckItem
        size="large"
        seatNumber="4A"
        checked={selectedSeat === '4A'}
        onCheckedChange={checked => onSeatChange('4A', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="4B"
        checked={selectedSeat === '4B'}
        onCheckedChange={checked => onSeatChange('4B', checked)}
      />
      <Aisle withIcon />
      <SeatCheckItem
        size="large"
        seatNumber="4C"
        checked={selectedSeat === '4C'}
        onCheckedChange={checked => onSeatChange('4C', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="4D"
        checked={selectedSeat === '4D'}
        onCheckedChange={checked => onSeatChange('4D', checked)}
      />

      {/* Row 5 */}
      <SeatCheckItem
        size="large"
        seatNumber="5A"
        checked={selectedSeat === '5A'}
        onCheckedChange={checked => onSeatChange('5A', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="5B"
        checked={selectedSeat === '5B'}
        onCheckedChange={checked => onSeatChange('5B', checked)}
      />
      <Aisle withIcon />
      <SeatCheckItem
        size="large"
        seatNumber="5C"
        checked={selectedSeat === '5C'}
        onCheckedChange={checked => onSeatChange('5C', checked)}
      />
      <SeatCheckItem
        size="large"
        seatNumber="5D"
        checked={selectedSeat === '5D'}
        onCheckedChange={checked => onSeatChange('5D', checked)}
      />
    </Box>
  );
};

const Aisle = ({ withIcon = false }) => (
  <Box display="flex" justifyContent="center" alignItems="center">
    {withIcon ? <CaretUpOutlined /> : <Box width="15px" />}
  </Box>
);
