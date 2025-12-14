import { ark } from '@ark-ui/react';
import { css } from 'styled-system/css';
import { HStack } from 'styled-system/jsx';
import { RightOutlined } from '@/ui-lib/components/Icon';
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
        <Typography variant="C1_Bold" color="static.bold" flex={1} textAlign="left">
          랜덤 쿠폰 등장!
        </Typography>
        <RightOutlined />
      </HStack>
    </ark.button>
  );
};
