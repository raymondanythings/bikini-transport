import { ark } from '@ark-ui/react'
import { Box, Divider, Flex, Grid, HStack, VStack } from 'styled-system/jsx'
import { Accordion } from '@/ui-lib/components/Accordion'
import { Button } from '@/ui-lib/components/Button'
import { CircleOutlined, CloseOutlined, DownOutlined, SwapRightOutlined } from '@/ui-lib/components/Icon'
import { Tag } from '@/ui-lib/components/Tag'
import { Header } from '../../layout/Header'
import { Typography } from '../../ui-lib/components/Typography'

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
          <Flex direction="column" p="5" gap="5">
            <Flex direction="column" gap="4">
              <Accordion
                items={[
                  {
                    key: '노선',
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
                    children: <TicketDetailCard />,
                    indicator: <DownOutlined />,
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
                    <Typography color="secondary.heavy">2₴</Typography>가 할인되었어요!
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
    </Flex>
  )
}

const TicketDetailCard = () => {
  return (
    <Grid py="2" gridTemplateColumns="auto 1fr" columnGap="3">
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
      </Flex>

      {/* 마지막 도착지  */}
      <Flex direction="column" alignItems="center">
        <Divider orientation="vertical" height="1.5" color="line.normal" />
        <CircleOutlined color="bus.suburb" />
      </Flex>
      <Typography variant="B2_Bold" color="label.normal">
        구-라군
      </Typography>
    </Grid>
  )
}
