import { HStack } from 'styled-system/jsx'
import { BottomSheet } from '@/ui-lib/components/BottomSheet'
import { Button } from '@/ui-lib/components/Button'

export const PaymentCancelBottomSheet = () => {
  return (
    <BottomSheet
      open={true}
      header={<BottomSheet.Header>결제를 그만두시겠어요?</BottomSheet.Header>}
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
      내용
    </BottomSheet>
  )
}
