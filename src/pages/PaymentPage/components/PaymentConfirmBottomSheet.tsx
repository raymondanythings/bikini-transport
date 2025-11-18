import { Box, Divider, Grid, HStack } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { Typography } from '@/ui-lib/components/Typography';

export const PaymentConfirmBottomSheet = () => {
  return (
    <BottomSheet
      open={false}
      header={<BottomSheet.Header>버스표 결제를 진행하시겠어요?</BottomSheet.Header>}
      cta={
        <HStack>
          <Button key="취소" color="secondary" fullWidth>
            취소
          </Button>
          <Button key="결제하기" fullWidth>
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
          <Typography variant="B1_Bold" color="static.black">
            노선
          </Typography>
          <Divider orientation="vertical" height="2.5" color="label.disable" />
          <Typography variant="B1_Regular" color="static.black">
            비키니항구 → 구-라군
          </Typography>

          <Typography variant="B1_Bold" color="static.black">
            출발 일시
          </Typography>
          <Divider orientation="vertical" height="2.5" color="label.disable" />
          <Typography variant="B1_Regular" color="static.black">
            2025년 00월 00일 (수) 00:00
          </Typography>

          <Typography variant="B1_Bold" color="static.black">
            소요 시간
          </Typography>
          <Divider orientation="vertical" height="2.5" color="label.disable" />
          <Typography variant="B1_Regular" color="static.black">
            총 00시간 00분
          </Typography>

          <Typography variant="B1_Bold" color="static.black">
            환승 횟수
          </Typography>
          <Divider orientation="vertical" height="2.5" color="label.disable" />
          <Typography variant="B1_Regular" color="static.black">
            3회
          </Typography>

          <Typography variant="B1_Bold" color="static.black">
            결제 금액
          </Typography>
          <Divider orientation="vertical" height="2.5" color="label.disable" />
          <Typography variant="B1_Regular" color="static.black">
            0,000원
          </Typography>
        </Grid>
      </Box>
    </BottomSheet>
  );
};
