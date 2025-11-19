import { Box, type BoxProps, Divider, HStack, VStack } from 'styled-system/jsx';
import { SwapRightOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

interface TripSummaryProps extends BoxProps {
  date: string;
  departure: string;
  arrival: string;
  totalTime: string;
  transferCount: string;
}

export function TripSummary({ date, departure, arrival, totalTime, transferCount, ...props }: TripSummaryProps) {
  return (
    <Box {...props}>
      <VStack gap="3" p="5">
        <Typography variant="C2_Regular" color="label.normal">
          {date}
        </Typography>
        <HStack gap="6">
          <Typography variant="H1_Bold" color="label.normal">
            {departure}
          </Typography>
          <SwapRightOutlined />
          <Typography variant="H1_Bold" color="label.normal">
            {arrival}
          </Typography>
        </HStack>
        <HStack gap="1">
          <Typography variant="C2_Regular" color="label.normal">
            {totalTime}
          </Typography>
          <Divider orientation="vertical" height="2.5" color="line.normal" />
          <Typography variant="C2_Regular" color="label.normal">
            {transferCount}
          </Typography>
        </HStack>
      </VStack>
    </Box>
  );
}
