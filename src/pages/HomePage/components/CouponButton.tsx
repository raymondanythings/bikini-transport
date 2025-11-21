import { ark } from '@ark-ui/react';
import { css } from 'styled-system/css';
import { HStack } from 'styled-system/jsx';
import { CheckCircleFilled, RightOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

interface CouponButtonProps {
  onClick?: () => void;
}
export const CouponButton = ({ onClick }: CouponButtonProps) => {
  return (
    <ark.button
      onClick={onClick}
      className={css({
        w: 'full',
        p: 4,
        backgroundColor: 'background.normal',
        borderRadius: 'xl',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.12)',
        _active: {
          transform: 'scale(0.98)',
        },
        _hover: {
          transform: 'scale(0.99)',
        },
      })}
    >
      <HStack gap={4} alignItems="center">
        <ark.img
          src="/coupon.png"
          className={css({
            height: '50px',
            width: 'auto',
          })}
        />
        <CouponAvailable />
      </HStack>
    </ark.button>
  );
};

// 쿠폰을 발급받기 전이라면 아래 컴포넌트를 보여주세요
const CouponAvailable = () => {
  return (
    <>
      <Typography variant="C1_Bold" color="static.bold" flex={1} textAlign="left">
        랜덤 쿠폰 등장!
      </Typography>
      <RightOutlined />
    </>
  );
};

// 쿠폰을 정상적으로 발급 받았다면 아래 컴포넌트를 보여주세요
const CouponReceived = () => {
  return (
    <>
      <Typography variant="C1_Bold" color="static.bold" flex={1} textAlign="left">
        진주패스를 받았어요!
      </Typography>
      <CheckCircleFilled size={32} />
    </>
  );
};
