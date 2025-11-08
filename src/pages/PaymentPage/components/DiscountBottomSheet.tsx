import { Box, HStack, VStack } from 'styled-system/jsx'
import { BottomSheet } from '@/ui-lib/components/BottomSheet'
import { Button } from '@/ui-lib/components/Button'
import { CheckCircleFilled, CheckCircleOutlined, CircleFilled } from '@/ui-lib/components/Icon'
import { Typography } from '@/ui-lib/components/Typography'

export const DiscountBottomSheet = () => {
  return (
    <BottomSheet
      open={false}
      header={<BottomSheet.Header>할인</BottomSheet.Header>}
      cta={[
        <Button key="사용하기" fullWidth>
          사용하기
        </Button>,
      ]}
    >
      <Box p={5} height="568px">
        <VStack gap={4}>
          <CouponOption
            discountAmount="기본요금 2₴"
            passName="진주(Pearl) 패스"
            conditions={['모든 노선에 적용 가능', '중복 할인 시 높은 할인률이 적용됨']}
            isSelected={true}
          />
          <CouponOption
            discountAmount="15% 할인"
            passName="달팽이 패스"
            conditions={['야간(21시 ~ 05시) 탑승 시 15% 요금 할인', '중복 할인 시 높은 할인률이 적용됨']}
            isSelected={false}
          />
          <CouponOption
            discountAmount="30% 할인"
            passName="투어 패스"
            conditions={['투어선 이외의 노선 이용 시 적용 불가', '중복 할인 시 높은 할인률이 적용됨']}
            isSelected={false}
          />
        </VStack>
      </Box>
    </BottomSheet>
  )
}

interface CouponOptionProps {
  discountAmount: string
  passName: string
  conditions: string[]
  isSelected: boolean
}
const CouponOption = ({ discountAmount, passName, conditions, isSelected }: CouponOptionProps) => {
  return (
    <HStack
      as="button"
      gap={5}
      p={5}
      width="full"
      justifyContent="space-between"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="line.neutral"
      borderRadius="xl"
      flexWrap="wrap"
    >
      <VStack gap={1} alignItems="start">
        <Typography variant="H0_Bold" color="label.normal">
          {discountAmount}
        </Typography>
        <Typography variant="B1_Medium" color="label.normal">
          {passName}
        </Typography>
        <VStack gap={1} alignItems="start">
          {conditions.map((condition, index) => (
            <HStack key={index} gap={1.5}>
              <CircleFilled />
              <Typography variant="C1_Medium" color="label.alternative">
                {condition}
              </Typography>
            </HStack>
          ))}
        </VStack>
      </VStack>
      {isSelected ? <CheckCircleFilled size={28} /> : <CheckCircleOutlined size={28} />}
    </HStack>
  )
}
