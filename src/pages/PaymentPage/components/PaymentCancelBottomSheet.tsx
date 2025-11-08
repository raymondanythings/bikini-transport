import { HStack, VStack } from 'styled-system/jsx'
import { BottomSheet } from '@/ui-lib/components/BottomSheet'
import { Button } from '@/ui-lib/components/Button'
import { ExclamationCircleFilled } from '@/ui-lib/components/Icon'
import { Typography } from '@/ui-lib/components/Typography'

export const PaymentCancelBottomSheet = () => {
  return (
    <BottomSheet
      open={false}
      header={
        <VStack gap={3} pt={5}>
          <ExclamationCircleFilled />
          <Typography variant="H2_Bold" color="label.normal">
            결제를 그만두시겠어요?
          </Typography>
        </VStack>
      }
      cta={
        <HStack>
          <Button key="아니요" color="secondary" fullWidth>
            아니요
          </Button>
          <Button key="결제취소" fullWidth>
            결제 취소
          </Button>
        </HStack>
      }
    >
      <Typography variant="B1_Medium" color="label.alternative" textAlign="center" pt="3" pb="5">
        지금 나가면 예매한 내용들이 모두 초기화돼요
      </Typography>
    </BottomSheet>
  )
}
