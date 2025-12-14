import { Box, type BoxProps, Divider, Flex } from 'styled-system/jsx';
import { CircleOutlined } from '@/ui-lib/components/Icon';
import { Tag } from '@/ui-lib/components/Tag';
import { Typography } from '@/ui-lib/components/Typography';

type BusLineType = 'TOUR' | 'CITY' | 'SUBURB';

const RouteDetailRoot = ({ children, ...props }: Omit<BoxProps, 'display' | 'gridTemplateColumns' | 'columnGap'>) => {
  return (
    <Box display="grid" gridTemplateColumns="auto 1fr" columnGap="3" {...props}>
      {children}
    </Box>
  );
};

const RouteDetailStation = ({
  line,
  stationName,
  travelTime,
  stopsCount,
}: {
  line: {
    name: string;
    type: BusLineType;
  };
  stationName: string;
  travelTime: string;
  stopsCount: string;
}) => {
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
      </Flex>
    </>
  );
};

const RouteDetailArrivalStation = ({ stationName, lineType }: { stationName: string; lineType: BusLineType }) => {
  return (
    <>
      <Flex direction="column" alignItems="center">
        <Divider orientation="vertical" height="1.5" color="line.normal" />
        {(() => {
          switch (lineType) {
            case 'TOUR':
              return <CircleOutlined color="bus.tour" size={10} />;
            case 'CITY':
              return <CircleOutlined color="bus.city" size={10} />;
            case 'SUBURB':
              return <CircleOutlined color="bus.suburb" size={10} />;
            default:
              return <CircleOutlined size={10} />;
          }
        })()}
      </Flex>
      <Typography variant="B2_Bold" color="label.normal">
        {stationName}
      </Typography>
    </>
  );
};

export const RouteDetail = {
  Root: RouteDetailRoot,
  Station: RouteDetailStation,
  ArrivalStation: RouteDetailArrivalStation,
};
