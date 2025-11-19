import { ark } from '@ark-ui/react';
import { Box, Divider, Flex, HStack } from 'styled-system/jsx';
import { RouteDetail } from '@/components/RouteDetail';
import { TripSummary } from '@/components/TripSummary';
import { Accordion } from '@/ui-lib/components/Accordion';
import { Button } from '@/ui-lib/components/Button';
import { CloseOutlined, DownOutlined } from '@/ui-lib/components/Icon';
import { Tag } from '@/ui-lib/components/Tag';
import { Header } from '../../layout/Header';
import { Typography } from '../../ui-lib/components/Typography';
import { DiscountBottomSheet } from './components/DiscountBottomSheet';
import { PaymentCancelBottomSheet } from './components/PaymentCancelBottomSheet';
import { PaymentConfirmBottomSheet } from './components/PaymentConfirmBottomSheet';

export const PaymentPage = () => {
  return (
    <Flex direction="column" height="screen">
      <Header>
        <Header.Left>
          <ark.button>
            <CloseOutlined />
          </ark.button>
        </Header.Left>
        <Header.Center>
          <Typography variant="H1_Bold">결제</Typography>
        </Header.Center>
      </Header>

      <Box flex="1" overflowY="auto" pt="5" pb="2.5" px="5">
        <Box borderWidth="1px" borderStyle="solid" borderColor="line.neutral" borderRadius="xl">
          <TripSummary
            date="10월 28일 (화) 09:00"
            departure="비키니환초"
            arrival="구-라군"
            totalTime="총 8시간 6분"
            transferCount="환승 3회"
            backgroundColor="background.neutral"
            borderTopRadius="xl"
          />
          <Flex direction="column" p="5" gap="5">
            <Flex direction="column" gap="4">
              <Accordion
                items={[
                  {
                    key: '노선',
                    indicator: <DownOutlined />,
                    label: (
                      <HStack gap="5">
                        <Typography variant="B1_Bold" color="label.normal">
                          노선
                        </Typography>
                        <Typography variant="B2_Medium" color="label.normal">
                          투어선 외 2대
                        </Typography>
                      </HStack>
                    ),
                    children: (
                      <RouteDetail py="2">
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
                      </RouteDetail>
                    ),
                  },
                ]}
              />
              <HStack gap="5">
                <Typography variant="B1_Bold" color="label.normal">
                  좌석
                </Typography>
                <HStack>
                  <Tag>1A</Tag>
                  <Tag>2B</Tag>
                  <Tag>2B</Tag>
                </HStack>
              </HStack>
            </Flex>
            <Divider color="line.neutral" />
            <Flex direction="column" gap="4">
              <HStack gap="5" justify="space-between">
                <Typography variant="B1_Bold" color="label.normal">
                  요금
                </Typography>
                <HStack>
                  <Typography variant="C2_Medium" color="label.disable" textDecoration="line-through">
                    23,700원
                  </Typography>
                  <Typography variant="B1_Bold" color="label.normal">
                    10,000원
                  </Typography>
                </HStack>
              </HStack>
              <HStack gap="5" justify="space-between">
                <Typography variant="B1_Bold" color="label.normal">
                  할인
                </Typography>
                <Button color="secondary" size="small" icon={<CloseOutlined size={16} />} iconPosition="end">
                  <Flex>
                    <Typography variant="B2_Medium" color="secondary.heavy">
                      2₴
                    </Typography>
                    가 할인되었어요!
                  </Flex>
                </Button>
              </HStack>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Box px={5} py={4} flexShrink={0}>
        <Button fullWidth>확인</Button>
      </Box>
      <DiscountBottomSheet />
      <PaymentConfirmBottomSheet />
      <PaymentCancelBottomSheet />
    </Flex>
  );
};
