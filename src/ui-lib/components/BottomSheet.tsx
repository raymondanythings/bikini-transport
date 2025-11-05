import { Dialog, Portal } from '@ark-ui/react'
import type React from 'react'
import type { ReactNode } from 'react'
import { styled } from 'styled-system/jsx'
import { Button } from './Button'

const Backdrop = styled(Dialog.Backdrop, {
  base: {
    pos: 'fixed',
    inset: 0,
    bgColor: 'static.black',
    opacity: 0.5,
    zIndex: 1000,
  },
})

const Positioner = styled(Dialog.Positioner, {
  base: {
    pos: 'fixed',
    inset: 0,
    zIndex: 1001,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
})

const Content = styled(Dialog.Content, {
  base: {
    bgColor: 'background.normal',
    w: 'full',
    maxW: '100vw',
    roundedTop: '20px',
    pb: 'env(safe-area-inset-bottom, 0px)',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
  },
})

const Handle = styled('div', {
  base: {
    w: 14,
    h: 1,
    bgColor: '#D9D9D9',
    rounded: 'full',
    mx: 'auto',
    mt: 3,
    mb: 2.5,
  },
})

const Header = styled(Dialog.Title, {
  base: {
    px: 6,
    py: 3,
    textStyle: 'H2_Bold',
    color: 'label.normal',
    textAlign: 'center',
  },
})

const ContentWrapper = styled('div', {
  base: {
    flex: 1,
    overflowY: 'auto',
  },
})

const CTAWrapper = styled('div', {
  base: {
    px: 5,
    py: 4,
  },
})

export interface BottomSheetProps {
  /**
   * BottomSheet 열림 상태
   */
  open: boolean
  /**
   * Backdrop 클릭 핸들러
   */
  onDimmerClick?: () => void
  /**
   * BottomSheet 헤더 영역
   */
  header?: ReactNode
  /**
   * BottomSheet CTA 버튼 영역
   */
  cta?: ReactNode
  /**
   * BottomSheet 컨텐츠
   */
  children: ReactNode
}

export const BottomSheet = ({ open, onDimmerClick, header, cta, children }: BottomSheetProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => !open && onDimmerClick?.()}>
      <Portal>
        <Backdrop />
        <Positioner>
          <Content>
            <Handle />
            {header}
            <ContentWrapper>{children}</ContentWrapper>
            {cta && <CTAWrapper>{cta}</CTAWrapper>}
          </Content>
        </Positioner>
      </Portal>
    </Dialog.Root>
  )
}

BottomSheet.Header = function BottomSheetHeader({ children }: { children: ReactNode }) {
  return <Header>{children}</Header>
}

BottomSheet.CTA = function BottomSheetCTA(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />
}
