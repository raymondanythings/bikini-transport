import { overlay } from 'overlay-kit';
import { HStack, VStack } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { ExclamationCircleFilled } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

interface SeatCancelBottomSheetProps {
  isOpen: boolean;
  close: () => void;
}

export const openSeatCancelBottomSheet = () => {
  return overlay.open(({ isOpen, close }) => <SeatCancelBottomSheet isOpen={isOpen} close={close} />);
};

export const SeatCancelBottomSheet = ({ isOpen, close }: SeatCancelBottomSheetProps) => {
  return (
    <BottomSheet
      open={isOpen}
      onDimmerClick={close}
      header={
        <VStack gap={3} pt={5}>
          <ExclamationCircleFilled size={36} />
          <Typography variant="H2_Bold" color="label.normal">
            좌석 선택을 그만하시겠어요?
          </Typography>
        </VStack>
      }
      cta={
        <HStack>
          <Button color="secondary" fullWidth onClick={() => {}}>
            취소
          </Button>
          <Button fullWidth onClick={() => {}}>
            그만하기
          </Button>
        </HStack>
      }
    >
      <Typography variant="B1_Medium" color="label.alternative" textAlign="center" pt="3" pb="5">
        지금 나가면 예매한 내용들이 모두 사라져요
      </Typography>
    </BottomSheet>
  );
};
