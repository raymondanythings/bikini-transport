import { ark, RadioGroup } from '@ark-ui/react';
import { overlay } from 'overlay-kit';
import { css } from 'styled-system/css';
import { Box, VStack } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { Typography } from '@/ui-lib/components/Typography';
import { CouponRadioItem } from './CouponRadioItem';

interface CouponBottomSheetProps {
  isOpen: boolean;
  close: () => void;
}

export const openCouponBottomSheet = () => {
  return overlay.open(({ isOpen, close }) => <CouponBottomSheet isOpen={isOpen} close={close} />);
};

export const CouponBottomSheet = ({ isOpen, close }: CouponBottomSheetProps) => {
  return (
    <BottomSheet
      open={isOpen}
      onDimmerClick={close}
      header={<BottomSheet.Header>쿠폰함</BottomSheet.Header>}
      cta={
        <Button fullWidth onClick={() => {}}>
          사용하기
        </Button>
      }
    >
      {/* 보유한 쿠폰이 없을 경우, 아래 컴포넌트를 보여주세요 */}
      {/* <NoCoupon /> */}

      {/* 보유한 쿠폰이 있을 경우, 아래 컴포넌트를 보여주세요 */}
      <Box p={5}>
        <RadioGroup.Root
          defaultValue="PEARL_PASS"
          onValueChange={details => {
            console.log(details.value);
          }}
        >
          <VStack gap={4}>
            <CouponRadioItem
              value="PEARL_PASS"
              discountAmount="기본요금 2₴"
              couponName="진주(Pearl) 패스"
              conditions={['모든 노선에 적용 가능', '중복 할인 시 높은 할인률이 적용됨']}
            />

            <CouponRadioItem
              value="GARY_NIGHT"
              discountAmount="15% 할인"
              couponName="달팽이 패스"
              conditions={['야간(21시 ~ 05시) 탑승 시 15% 요금 할인', '중복 할인 시 높은 할인률이 적용됨']}
            />

            <CouponRadioItem
              value="TOUR_FUN"
              discountAmount="30% 할인"
              couponName="투어 패스"
              conditions={['투어선 이외의 노선 이용 시 적용 불가', '중복 할인 시 높은 할인률이 적용됨']}
            />
          </VStack>
        </RadioGroup.Root>
      </Box>
    </BottomSheet>
  );
};

const NoCoupon = () => {
  return (
    <VStack gap="3" p="5" height="540px" justifyContent="center">
      <ark.img
        src="/emply-spongebob.png"
        className={css({
          width: '180px',
          height: '180px',
        })}
      />
      <Typography variant="H2_Bold" color="label.normal">
        사용할 수 있는 쿠폰이 없어요
      </Typography>
      <Typography variant="B1_Medium" color="label.alternative">
        쿠폰은 메인 화면에서 랜덤으로 획득할 수 있어요
      </Typography>
    </VStack>
  );
};
