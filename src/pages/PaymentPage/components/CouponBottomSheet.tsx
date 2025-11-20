import { RadioGroup } from '@ark-ui/react';
import { overlay } from 'overlay-kit';
import type { ComponentPropsWithoutRef } from 'react';
import { css } from 'styled-system/css';
import { Box, HStack, VStack } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { Button } from '@/ui-lib/components/Button';
import { CheckCircleFilled, CheckCircleOutlined, CircleFilled } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

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
      header={<BottomSheet.Header>할인</BottomSheet.Header>}
      cta={
        <Button key="사용하기" fullWidth>
          사용하기
        </Button>
      }
    >
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

const CouponRadioItem = ({
  discountAmount,
  couponName,
  conditions,
  ...props
}: ComponentPropsWithoutRef<typeof RadioGroup.Item> & {
  discountAmount: string;
  couponName: string;
  conditions: string[];
}) => {
  return (
    <RadioGroup.Item className={css({ w: 'full' })} {...props}>
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemControl asChild>
        <HStack
          gap={5}
          p={5}
          width="full"
          justifyContent="space-between"
          borderWidth="1px"
          borderStyle="solid"
          borderRadius="xl"
          cursor="pointer"
          transition="all 0.2s"
          borderColor="line.neutral"
          _checked={{
            borderColor: 'primary.normal',
          }}
        >
          <VStack gap={1} alignItems="start" flex={1}>
            <Typography variant="H0_Bold" color="label.normal">
              {discountAmount}
            </Typography>
            <Typography variant="B1_Medium" color="label.normal">
              {couponName}
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
          <RadioGroup.ItemContext>
            {({ checked }) => (checked ? <CheckCircleFilled size={28} /> : <CheckCircleOutlined size={28} />)}
          </RadioGroup.ItemContext>
        </HStack>
      </RadioGroup.ItemControl>
    </RadioGroup.Item>
  );
};
