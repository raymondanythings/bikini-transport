import { createToaster, Toast, Toaster } from '@ark-ui/react';
import { sva } from 'styled-system/css';
import { CheckCircleFilled, ExclamationCircleFilled } from './Icon';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

const toast = sva({
  slots: ['root', 'title', 'description', 'closeTrigger'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      padding: 4,
      borderRadius: 'xl',
      width: 'full',
      backgroundColor: 'static.darkGrayAlpha',

      translate: 'var(--x) var(--y)',
      scale: 'var(--scale)',
      zIndex: 'var(--z-index)',
      height: 'var(--height)',
      opacity: 'var(--opacity)',

      willChange: 'translate, opacity, scale',
      transition: 'translate 400ms, scale 400ms, opacity 400ms, height 400ms',
      transitionTimingFunction: 'cubic-bezier(0.21, 1.02, 0.73, 1)',

      animation: 'slideUp 0.3s ease-out',
      '&[data-state="closed"]': {
        animation: 'slideDown 0.3s ease-in',
      },
    },
    title: {
      textStyle: 'C1_Bold',
      color: 'label.inverse',
    },
  },
  variants: {
    type: {
      success: {
        root: { borderColor: 'status.positive' },
      },
      error: {
        root: { borderColor: 'status.destructive' },
      },
      warning: {
        root: { borderColor: 'status.warning' },
      },
      info: {
        root: { borderColor: 'status.safety' },
      },
    },
  },
  defaultVariants: {
    type: 'info',
  },
});

export const toaster = createToaster({
  placement: 'bottom',
  overlap: true,
  gap: 16,
  offsets: {
    top: '0',
    right: '20px',
    left: '20px',
    bottom: '95px',
  },
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster toaster={toaster}>
        {item => {
          const type = (item.type as ToastType) || 'info';
          const classes = toast({ type });
          return (
            <Toast.Root key={item.id} className={classes.root}>
              {(() => {
                switch (type) {
                  case 'success':
                    return <CheckCircleFilled color="status.positive" innerColor="static.darkGrayAlpha" size={20} />;
                  case 'error':
                    return (
                      <ExclamationCircleFilled color="status.destructive" innerColor="static.darkGrayAlpha" size={20} />
                    );
                  case 'warning':
                    return (
                      <ExclamationCircleFilled color="status.warning" innerColor="static.darkGrayAlpha" size={20} />
                    );
                  case 'info':
                  default:
                    return (
                      <ExclamationCircleFilled color="status.safety" innerColor="static.darkGrayAlpha" size={20} />
                    );
                }
              })()}
              <Toast.Title className={classes.title}>{item.title}</Toast.Title>
            </Toast.Root>
          );
        }}
      </Toaster>
    </>
  );
}
