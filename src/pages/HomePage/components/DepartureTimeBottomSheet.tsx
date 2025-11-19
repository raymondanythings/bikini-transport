import { overlay } from 'overlay-kit';
import { HStack } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { DateTimePicker } from '@/ui-lib/components/DateTimePicker';

interface DepartureTimeBottomSheetProps {
  isOpen: boolean;
  close: () => void;
}

export const openDepartureTimeBottomSheet = () => {
  return overlay.open(({ isOpen, close }) => <DepartureTimeBottomSheet isOpen={isOpen} close={close} />);
};

export const DepartureTimeBottomSheet = ({ isOpen, close }: DepartureTimeBottomSheetProps) => {
  return (
    <BottomSheet
      open={isOpen}
      onDimmerClick={close}
      header={<BottomSheet.Header>출발 시간 설정</BottomSheet.Header>}
      cta={
        <HStack>
          <Button key="지금 출발" color="secondary" fullWidth>
            지금 출발
          </Button>
          <Button key="확인" fullWidth>
            확인
          </Button>
        </HStack>
      }
    >
      <DateTimePicker
        initialValue={new Date()}
        onChange={(date: Date) => {
          console.log('Selected date:', date);
        }}
      />
    </BottomSheet>
  );
};
