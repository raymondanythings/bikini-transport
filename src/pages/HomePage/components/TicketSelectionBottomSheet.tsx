import { Box, Divider, Flex, HStack, VStack } from 'styled-system/jsx'
import { BottomSheet } from '@/ui-lib/components/BottomSheet'
import { Button } from '@/ui-lib/components/Button'
import { CircleOutlined, ExclamationCircleFilled, SwapRightOutlined } from '@/ui-lib/components/Icon'
import { Tabs } from '@/ui-lib/components/Tabs'
import { Tag } from '@/ui-lib/components/Tag'
import { Typography } from '@/ui-lib/components/Typography'

export const TicketSelectionBottomSheet = () => {
  return (
    <BottomSheet open={true} header={<BottomSheet.Header>버스표 선택</BottomSheet.Header>}>
      <Tabs
        items={[
          {
            key: '최단시간',
            label: '최단시간',
            children: (
              <>
                <Flex p="5" direction="column" gap="3.5" height="480px" overflowY="auto">
                  <DepartureArrivalCard />
                  <TicketDetailCard />
                </Flex>
                <Box px="5" py="4">
                  <Button fullWidth>10,000원 결재하기</Button>
                </Box>
              </>
            ),
          },
          {
            key: '최소환승',
            label: '최소환승',
            children: (
              <>
                <Box height="480px" overflowY="auto" pt="140px">
                  <TicketSoldOut />
                </Box>
                <Box px="5" py="4">
                  <Button fullWidth>13,000원 결재하기</Button>
                </Box>
              </>
            ),
          },
          {
            key: '최저요금',
            label: '최저요금',
            children: (
              <>
                <Flex p="5" direction="column" gap="3.5" height="480px" overflowY="auto">
                  <DepartureArrivalCard />
                  <TicketDetailCard />
                </Flex>
                <Box px="5" py="4">
                  <Button fullWidth>12,000원 결재하기</Button>
                </Box>
              </>
            ),
          },
        ]}
      />
    </BottomSheet>
  )
}

const DepartureArrivalCard = () => {
  return (
    <VStack gap="3" p="5" backgroundColor="background.neutral" borderRadius="xl">
      <Typography variant="C2_Regular" color="label.normal">
        10월 28일 (화) 09:00
      </Typography>
      <HStack gap="6">
        <Typography variant="H1_Bold" color="label.normal">
          비키니환초
        </Typography>
        <SwapRightOutlined />
        <Typography variant="H1_Bold" color="label.normal">
          구-라군
        </Typography>
      </HStack>
      <HStack gap="1">
        <Typography variant="C2_Regular" color="label.normal">
          총 8시간 6분
        </Typography>
        <Divider orientation="vertical" height="2.5" color="line.normal" />

        <Typography variant="C2_Regular" color="label.normal">
          환승 3회
        </Typography>
      </HStack>
    </VStack>
  )
}

const TicketDetailCard = () => {
  return (
    <Box
      p="5"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="line.neutral"
      borderRadius="xl"
      display="grid"
      gridTemplateColumns="auto 1fr"
      columnGap="3"
    >
      {/* 정류장 1 */}
      <Flex direction="column" alignItems="center">
        <Tag color="tour">투어선</Tag>
        <Divider orientation="vertical" height="100%" color="line.normal" />
      </Flex>
      <Flex direction="column" gap="1" pb="4">
        <Typography variant="B2_Bold" color="label.normal">
          비키니환초
        </Typography>
        <Flex alignItems="center" gap="1">
          <Typography variant="C2_Regular" color="label.alternative">
            20분
          </Typography>
          <Divider orientation="vertical" height="2.5" color="line.normal" />
          <Typography variant="C2_Regular" color="label.alternative">
            8정거장 이동
          </Typography>
        </Flex>
        <Typography variant="C2_Regular" color="status.destructive">
          12분 50초
        </Typography>
      </Flex>

      {/* 정류장 2 */}
      <Flex direction="column" alignItems="center">
        <Tag color="city">시티선</Tag>
        <Divider orientation="vertical" height="100%" color="line.normal" />
      </Flex>
      <Flex direction="column" gap="1" pb="4">
        <Typography variant="B2_Bold" color="label.normal">
          징징빌라
        </Typography>
        <Flex alignItems="center" gap="1">
          <Typography variant="C2_Regular" color="label.alternative">
            20분
          </Typography>
          <Divider orientation="vertical" height="2.5" color="line.normal" />
          <Typography variant="C2_Regular" color="label.alternative">
            8정거장 이동
          </Typography>
        </Flex>
        <Typography variant="C2_Regular" color="status.destructive">
          10분 50초
        </Typography>
      </Flex>

      {/* 정류장 3 */}
      <Flex direction="column" alignItems="center">
        <Tag color="suburb">외곽선</Tag>
        <Divider orientation="vertical" height="100%" color="line.normal" />
      </Flex>
      <Flex direction="column" gap="1" pb="4">
        <Typography variant="B2_Bold" color="label.normal">
          다시마 숲
        </Typography>
        <Flex alignItems="center" gap="1">
          <Typography variant="C2_Regular" color="label.alternative">
            20분
          </Typography>
          <Divider orientation="vertical" height="2.5" color="line.normal" />
          <Typography variant="C2_Regular" color="label.alternative">
            5정거장 이동
          </Typography>
        </Flex>
        <Typography variant="C2_Regular" color="status.destructive">
          30분 3초
        </Typography>
      </Flex>

      {/* 마지막 도착지  */}
      <Flex direction="column" alignItems="center">
        <Divider orientation="vertical" height="1.5" color="line.normal" />
        <CircleOutlined color="bus.suburb" />
      </Flex>
      <Typography variant="B2_Bold" color="label.normal">
        구-라군
      </Typography>
    </Box>
  )
}

const TicketSoldOut = () => {
  return (
    <VStack gap="3" p="5">
      <ExclamationCircleFilled />
      <Typography variant="H2_Bold" color="label.normal">
        버스표가 모두 매진되었어요
      </Typography>
      <Typography variant="B1_Medium" color="label.alternative">
        다른 날짜나 시간대를 선택해주세요
      </Typography>
    </VStack>
  )
}
