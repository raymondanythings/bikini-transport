import { Box, type BoxProps, Divider, Flex } from 'styled-system/jsx';
import { CircleOutlined } from '@/ui-lib/components/Icon';
import { Tag } from '@/ui-lib/components/Tag';
import { Typography } from '@/ui-lib/components/Typography';

type BusLineType = 'tour' | 'city' | 'suburb';

export function RouteDetail({ children, ...props }: BoxProps) {
  return (
    <Box display="grid" gridTemplateColumns="auto 1fr" columnGap="3" {...props}>
      {children}
    </Box>
  );
}

interface StationProps {
  line: {
    name: string;
    type: BusLineType;
  };
  stationName: string;
  travelTime: string;
  stopsCount: string;
  waitingTime?: string;
}

const Station = ({ line, stationName, travelTime, stopsCount, waitingTime }: StationProps) => {
  return (
    <>
      <Flex direction="column" alignItems="center">
        <Tag color={line.type}>{line.name}</Tag>
        <Divider orientation="vertical" height="100%" color="line.normal" />
      </Flex>
      <Flex direction="column" gap="1" pb="4">
        <Typography variant="B2_Bold" color="label.normal">
          {stationName}
        </Typography>
        <Flex alignItems="center" gap="1">
          <Typography variant="C2_Regular" color="label.alternative">
            {travelTime}
          </Typography>
          <Divider orientation="vertical" height="2.5" color="line.normal" />
          <Typography variant="C2_Regular" color="label.alternative">
            {stopsCount}
          </Typography>
        </Flex>
        {waitingTime && (
          <Typography variant="C2_Regular" color="status.destructive">
            {waitingTime}
          </Typography>
        )}
      </Flex>
    </>
  );
};

interface ArrivalStationProps {
  stationName: string;
  lineType: BusLineType;
}

const ArrivalStation = ({ stationName, lineType }: ArrivalStationProps) => {
  return (
    <>
      <Flex direction="column" alignItems="center">
        <Divider orientation="vertical" height="1.5" color="line.normal" />
        {(() => {
          switch (lineType) {
            case 'tour':
              return <CircleOutlined color="bus.tour" />;
            case 'city':
              return <CircleOutlined color="bus.city" />;
            case 'suburb':
              return <CircleOutlined color="bus.suburb" />;
            default:
              return <CircleOutlined />;
          }
        })()}
      </Flex>
      <Typography variant="B2_Bold" color="label.normal">
        {stationName}
      </Typography>
    </>
  );
};

RouteDetail.Station = Station;
RouteDetail.ArrivalStation = ArrivalStation;
