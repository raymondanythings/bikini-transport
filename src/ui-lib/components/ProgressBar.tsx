import { Progress } from '@ark-ui/react';
import { forwardRef } from 'react';
import { sva } from 'styled-system/css';

const progressBar = sva({
  slots: ['root', 'track', 'range'],
  base: {
    root: {
      position: 'relative',
      w: 'full',
    },
    track: {
      w: 'full',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: 'background.alternative',
    },
    range: {
      position: 'absolute',
      top: 0,
      left: 0,
      h: 'full',
      backgroundColor: 'primary.normal',
      transition: 'width 0.3s ease-in-out',
    },
  },
  variants: {
    size: {
      small: {
        track: { h: 1 },
      },
      medium: {
        track: { h: 1.5 },
      },
      large: {
        track: { h: 2 },
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

type ProgressBarProps = {
  /**
   * 진행률 (0 ~ 1 사이의 값)
   */
  value: number;
  /**
   * 크기
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>((props, ref) => {
  const { value, size = 'medium' } = props;

  const clampedValue = Math.min(Math.max(value, 0), 1);
  const percentage = clampedValue * 100;
  const classes = progressBar({ size });

  return (
    <Progress.Root ref={ref} value={percentage} className={classes.root}>
      <Progress.Track className={classes.track}>
        <Progress.Range className={classes.range} />
      </Progress.Track>
    </Progress.Root>
  );
});

ProgressBar.displayName = 'ProgressBar';
