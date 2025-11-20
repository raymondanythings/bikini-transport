import { Box, Divider, Flex, HStack } from 'styled-system/jsx';
import { RouteDetail } from '@/components/RouteDetail';
import { TripSummary } from '@/components/TripSummary';
import { Button } from '@/ui-lib/components/Button';
import { CloseOutlined } from '@/ui-lib/components/Icon';
import { Tag } from '@/ui-lib/components/Tag';
import { Typography } from '@/ui-lib/components/Typography';
import { openCouponBottomSheet } from './CouponBottomSheet';
import { PaymentDetailDescriptions } from './PaymentDetailDescriptions';

export const PaymentDetailSection = () => {
  return (
    <Box as="section" borderWidth="1px" borderStyle="solid" borderColor="line.neutral" borderRadius="xl">
      <TripSummary.Root borderTopRadius="xl" backgroundColor="background.neutral">
        <TripSummary.Content
          date="10월 28일 (화) 09:00"
          departure="비키니환초"
          arrival="구-라군"
          totalTime="총 8시간 6분"
          transferCount="환승 3회"
        />
      </TripSummary.Root>
      <Flex direction="column" p="5" gap="5">
        <TripDetails />
        <Divider color="line.neutral" />
        <PriceDetails />
      </Flex>
    </Box>
  );
};

const TripDetails = () => {
  return (
    <PaymentDetailDescriptions.Root>
      <PaymentDetailDescriptions.ExpandableItem
        key="route"
        label="노선"
        content={
          <RouteDetail.Root py="2">
            <RouteDetail.Station
              line={{ name: '투어선', type: 'tour' }}
              stationName="비키니환초"
              travelTime="20분"
              stopsCount="8정거장 이동"
              waitingTime="12분 50초"
            />
            <RouteDetail.Station
              line={{ name: '시티선', type: 'city' }}
              stationName="징징빌라"
              travelTime="20분"
              stopsCount="8정거장 이동"
              waitingTime="10분 50초"
            />
            <RouteDetail.Station
              line={{ name: '외곽선', type: 'suburb' }}
              stationName="다시마 숲"
              travelTime="20분"
              stopsCount="8정거장 이동"
              waitingTime="30분 3초"
            />
            <RouteDetail.ArrivalStation stationName="구-라군" lineType="suburb" />
          </RouteDetail.Root>
        }
      >
        <Typography variant="B2_Medium" color="label.normal">
          투어선 외 2대
        </Typography>
      </PaymentDetailDescriptions.ExpandableItem>
      <PaymentDetailDescriptions.Item label="좌석">
        <HStack>
          <Tag>1A</Tag>
          <Tag>2B</Tag>
          <Tag>2B</Tag>
        </HStack>
      </PaymentDetailDescriptions.Item>
    </PaymentDetailDescriptions.Root>
  );
};

const PriceDetails = () => {
  return (
    <PaymentDetailDescriptions.Root>
      <PaymentDetailDescriptions.Item label="요금" containerStyle={{ justify: 'space-between' }}>
        <HStack>
          <Typography variant="C2_Medium" color="label.disable" textDecoration="line-through">
            23,700원
          </Typography>
          <Typography variant="B1_Bold" color="label.normal">
            10,000원
          </Typography>
        </HStack>
      </PaymentDetailDescriptions.Item>

      <PaymentDetailDescriptions.Item label="할인" containerStyle={{ justify: 'space-between' }}>
        <AddCouponButton />
      </PaymentDetailDescriptions.Item>
    </PaymentDetailDescriptions.Root>
  );
};

const AddCouponButton = () => {
  return (
    <Button color="secondary" size="small" onClick={openCouponBottomSheet}>
      추가
    </Button>
  );
};

const AppliedCouponButton = () => {
  return (
    <Button color="secondary" size="small" icon={<CloseOutlined size={16} />} iconPosition="end">
      <Flex>
        <Typography variant="B2_Medium" color="secondary.heavy">
          2₴
        </Typography>
        가 할인되었어요!
      </Flex>
    </Button>
  );
};
