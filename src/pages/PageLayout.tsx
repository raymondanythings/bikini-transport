import { Box } from 'styled-system/jsx';

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Box minH="screen" backgroundColor="background.normal" pb="env(safe-area-inset-bottom, 0px)">
      {children}
    </Box>
  );
};
