import type { ReactNode } from 'react';
import { Box } from 'styled-system/jsx';

export const Header = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      as="header"
      h="56px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px="5"
      position="relative"
      flexShrink={0}
    >
      {children}
    </Box>
  );
};

Header.Left = ({ children }: { children: ReactNode }) => (
  <Box display="flex" alignItems="center" position="absolute" left="5" top="0" h="100%" zIndex="1">
    {children}
  </Box>
);

Header.Center = ({ children }: { children: ReactNode }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    position="absolute"
    left="50%"
    transform="translateX(-50%)"
    top="0"
    h="100%"
    zIndex="1"
  >
    {children}
  </Box>
);

Header.Right = ({ children }: { children: ReactNode }) => (
  <Box display="flex" alignItems="center" position="absolute" right="5" top="0" h="100%" zIndex="1">
    {children}
  </Box>
);
