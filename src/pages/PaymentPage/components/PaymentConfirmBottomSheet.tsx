import { overlay } from 'overlay-kit';
import { Box, Divider, Grid, HStack } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { Typography } from '@/ui-lib/components/Typography';

interface PaymentConfirmBottomSheetProps {
  isOpen: boolean;
  close: () => void;
}

export const openPaymentConfirmBottomSheet = () => {
  return overlay.open(({ isOpen, close }) => <PaymentConfirmBottomSheet isOpen={isOpen} close={close} />);
};

export const PaymentConfirmBottomSheet = ({ isOpen, close }: PaymentConfirmBottomSheetProps) => {
  return (
    <BottomSheet
      open={isOpen}
      onDimmerClick={close}
      header={<BottomSheet.Header>버스표를 결제하시겠어요?</BottomSheet.Header>}
      cta={
        <HStack>
          <Button color="secondary" fullWidth onClick={() => {}}>
            취소
          </Button>
          <Button fullWidth onClick={() => {}}>
            결제하기
          </Button>
        </HStack>
      }
    >
      <Box p={5}>
        <Grid
          borderRadius="xl"
          backgroundColor="background.neutral"
          p={5}
          gridTemplateColumns="auto auto 1fr"
          alignItems="center"
          gap={4}
          columnGap={2}
        >
          <DetailItem label="노선" value="비키니항구 → 구-라군" />
          <DetailItem label="출발 일시" value="2025년 00월 00일 (수) 00:00" />
          <DetailItem label="소요 시간" value="총 00시간 00분" />
          <DetailItem label="환승 횟수" value="3회" />
          <DetailItem label="결제 요금" value="23₴" />
        </Grid>
      </Box>
    </BottomSheet>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <>
      <Typography variant="B1_Bold" color="static.black">
        {label}
      </Typography>
      <Divider orientation="vertical" height="2.5" color="label.disable" />
      <Typography variant="B1_Regular" color="static.black">
        {value}
      </Typography>
    </>
  );
};
