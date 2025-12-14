import { ark } from '@ark-ui/react';
import { overlay } from 'overlay-kit';
import { css } from 'styled-system/css';
import { Flex, VStack } from 'styled-system/jsx';
import { RouteDetail } from '@/components/RouteDetail';
import { TripSummary } from '@/components/TripSummary';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { Tab } from '@/ui-lib/components/Tabs';
import { Typography } from '@/ui-lib/components/Typography';

interface RouteOptionsBottomSheetProps {
  isOpen: boolean;
  close: () => void;
}

export const openRouteOptionsBottomSheet = () => {
  return overlay.open(({ isOpen, close }) => <RouteOptionsBottomSheet isOpen={isOpen} close={close} />);
};

export const RouteOptionsBottomSheet = ({ isOpen, close }: RouteOptionsBottomSheetProps) => {
  return (
    <BottomSheet
      open={isOpen}
      onDimmerClick={close}
      header={<BottomSheet.Header>버스표 조회</BottomSheet.Header>}
      cta={
        <Button fullWidth onClick={() => {}}>
          좌석 선택하기
        </Button>
      }
    >
      {/* 예약 가능한 버스표가 없을 경우, 아래 컴포넌트를 보여주세요 */}
      {/* <TicketSoldOut /> */}

      {/* 예약 가능한 버스표가 있을 경우, 아래 컴포넌트를 보여주세요 */}
      <Tab.Root>
        <Tab.List>
          <Tab.Item value="최단시간">최단시간</Tab.Item>
          <Tab.Item value="최소환승">최소환승</Tab.Item>
          <Tab.Item value="최저요금">최저요금</Tab.Item>
        </Tab.List>
        <Tab.Content value="최단시간">
          <Flex p="5" direction="column" gap="3.5" height="490px" overflowY="auto">
            <TripSummary.Root borderRadius="xl" backgroundColor="background.neutral">
              <TripSummary.Content
                date="10월 28일 (화) 09:00"
                departure="비키니환초"
                arrival="구-라군"
                totalTime="총 8시간 6분"
                transferCount="환승 3회"
              />
            </TripSummary.Root>
            <RouteDetail.Root p="5" borderWidth="1px" borderStyle="solid" borderColor="line.neutral" borderRadius="xl">
              <RouteDetail.Station
                line={{ name: '투어선', type: 'TOUR' }}
                stationName="비키니환초"
                travelTime="20분"
                stopsCount="8정류장 이동"
                waitingTime="12분 50초"
              />
              <RouteDetail.ArrivalStation stationName="구-라군" lineType="TOUR" />
            </RouteDetail.Root>
          </Flex>
        </Tab.Content>
        <Tab.Content value="최소환승">
          <Flex p="5" direction="column" gap="3.5" height="490px" overflowY="auto">
            <TripSummary.Root borderRadius="xl" backgroundColor="background.neutral">
              <TripSummary.Content
                date="10월 28일 (화) 09:00"
                departure="비키니환초"
                arrival="구-라군"
                totalTime="총 8시간 6분"
                transferCount="환승 3회"
              />
            </TripSummary.Root>
            <RouteDetail.Root p="5" borderWidth="1px" borderStyle="solid" borderColor="line.neutral" borderRadius="xl">
              <RouteDetail.Station
                line={{ name: '투어선', type: 'TOUR' }}
                stationName="비키니환초"
                travelTime="20분"
                stopsCount="8정류장 이동"
                waitingTime="12분 50초"
              />
              <RouteDetail.Station
                line={{ name: '시티선', type: 'CITY' }}
                stationName="징징빌라"
                travelTime="20분"
                stopsCount="8정류장 이동"
                waitingTime="10분 50초"
              />
              <RouteDetail.ArrivalStation stationName="구-라군" lineType="CITY" />
            </RouteDetail.Root>
          </Flex>
        </Tab.Content>
        <Tab.Content value="최저요금">
          <Flex p="5" direction="column" gap="3.5" height="490px" overflowY="auto">
            <TripSummary.Root borderRadius="xl" backgroundColor="background.neutral">
              <TripSummary.Content
                date="10월 28일 (화) 09:00"
                departure="비키니환초"
                arrival="구-라군"
                totalTime="총 8시간 6분"
                transferCount="환승 3회"
              />
            </TripSummary.Root>
            <RouteDetail.Root p="5" borderWidth="1px" borderStyle="solid" borderColor="line.neutral" borderRadius="xl">
              <RouteDetail.Station
                line={{ name: '투어선', type: 'TOUR' }}
                stationName="비키니환초"
                travelTime="20분"
                stopsCount="8정류장 이동"
                waitingTime="12분 50초"
              />
              <RouteDetail.Station
                line={{ name: '시티선', type: 'CITY' }}
                stationName="징징빌라"
                travelTime="20분"
                stopsCount="8정류장 이동"
                waitingTime="10분 50초"
              />
              <RouteDetail.Station
                line={{ name: '외곽선', type: 'SUBURB' }}
                stationName="다시마 숲"
                travelTime="20분"
                stopsCount="8정류장 이동"
                waitingTime="30분 3초"
              />
              <RouteDetail.ArrivalStation stationName="구-라군" lineType="SUBURB" />
            </RouteDetail.Root>
          </Flex>
        </Tab.Content>
      </Tab.Root>
    </BottomSheet>
  );
};

const TicketSoldOut = () => {
  return (
    <VStack gap="3" p="5" height="540px" justifyContent="center">
      <ark.img
        src="/empty-patrick.png"
        className={css({
          width: '180px',
          height: '180px',
        })}
      />
      <Typography variant="H2_Bold" color="label.normal">
        버스표가 모두 매진되었어요
      </Typography>
      <Typography variant="B1_Medium" color="label.alternative">
        다른 날짜나 시간대를 선택해주세요
      </Typography>
    </VStack>
  );
};
