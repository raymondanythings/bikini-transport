import { Tabs as ArkTabs } from '@ark-ui/react'
import { styled } from 'styled-system/jsx'

const Root = styled(ArkTabs.Root, {
  base: {
    w: 'full',
  },
})

const List = styled(ArkTabs.List, {
  base: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid',
    borderBottomColor: 'line.normal',
    bgColor: 'background.normal',
  },
})

const Trigger = styled(ArkTabs.Trigger, {
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
})

const Indicator = styled(ArkTabs.Indicator, {
  base: {
    display: 'none',
  },
})

const Content = styled(ArkTabs.Content)

interface TabItem {
  key: string
  label: React.ReactNode
  children: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
  defaultActiveKey?: string
}

export const Tabs = ({ items, defaultActiveKey }: TabsProps) => {
  return (
    <Root defaultValue={defaultActiveKey || items[0]?.key}>
      <List>
        {items.map(item => (
          <Trigger key={item.key} value={item.key}>
            {item.label}
          </Trigger>
        ))}
      </List>
      {items.map(item => (
        <Content key={item.key} value={item.key}>
          {item.children}
        </Content>
      ))}
      <Indicator />
    </Root>
  )
}
