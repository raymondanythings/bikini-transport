import { Accordion as ArkAccordion } from '@ark-ui/react';
import { styled } from 'styled-system/jsx';

const Root = styled(ArkAccordion.Root, {
  base: {
    w: 'full',
  },
});

const Item = styled(ArkAccordion.Item);

const ItemTrigger = styled(ArkAccordion.ItemTrigger, {
  base: {
    w: 'full',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',

    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'primary.normal',
      outlineOffset: '-2px',
    },
  },
});

const ItemIndicator = styled(ArkAccordion.ItemIndicator, {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 250ms cubic-bezier(0.87, 0, 0.13, 1)',

    '&[data-state="open"]': {
      transform: 'rotate(-180deg)',
    },
  },
});

const ItemContent = styled(ArkAccordion.ItemContent, {
  base: { pt: 4 },
});

interface AccordionItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
  indicator?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultValue?: string[];
  multiple?: boolean;
  collapsible?: boolean;
}

export const Accordion = ({ items, defaultValue, multiple = false, collapsible = true }: AccordionProps) => {
  return (
    <Root defaultValue={defaultValue} multiple={multiple} collapsible={collapsible}>
      {items.map(item => (
        <Item key={item.key} value={item.key}>
          <ItemTrigger>
            {item.label}
            {item.indicator && <ItemIndicator>{item.indicator}</ItemIndicator>}
          </ItemTrigger>
          <ItemContent>{item.children}</ItemContent>
        </Item>
      ))}
    </Root>
  );
};
