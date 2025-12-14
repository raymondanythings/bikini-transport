import { Tabs as ArkTabs } from '@ark-ui/react';
import type { ComponentPropsWithoutRef } from 'react';
import { styled } from 'styled-system/jsx';

const Root = styled(ArkTabs.Root, {
  base: {
    w: 'full',
  },
});

export const TabList = styled(ArkTabs.List, {
  base: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid',
    borderBottomColor: 'line.normal',
    bgColor: 'background.normal',
  },
});

export const TabItem = styled(ArkTabs.Trigger, {
  base: {
    flex: 1,
    textStyle: 'B2_Bold',
    color: 'label.disable',
    px: 4,
    py: 3.5,
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    pos: 'relative',
    transition: 'all 0.2s ease-in-out',

    _selected: {
      color: 'label.normal',
      _after: {
        content: '""',
        pos: 'absolute',
        bottom: '-1px',
        left: 0,
        right: 0,
        h: '2px',
        bgColor: 'label.normal',
      },
    },

    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'primary.normal',
      outlineOffset: '-2px',
    },
  },
});

const TabContent = styled(ArkTabs.Content);

type TabsProps = Omit<ComponentPropsWithoutRef<typeof ArkTabs.Root>, 'onValueChange'> & {
  onValueChange?: (value: string) => void;
};

const TabRoot = ({ onValueChange, ...props }: TabsProps) => {
  return (
    <Root
      {...props}
      onValueChange={details => {
        onValueChange?.(details.value);
      }}
    />
  );
};

export const Tab = {
  Root: TabRoot,
  List: TabList,
  Item: TabItem,
  Content: TabContent,
};
