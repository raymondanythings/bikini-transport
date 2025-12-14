import { Divider, HStack, VStack } from 'styled-system/jsx';
import { SwapRightOutlined } from '@/ui-lib/components/Icon';
import { Typography } from '@/ui-lib/components/Typography';

export const BusInfoSection = () => {
  return (
    <VStack gap="3" p="5" backgroundColor="background.normal" borderRadius="xl">
      <HStack gap="4">
        <Typography variant="B1_Bold" color="label.normal">
          비키니시티
        </Typography>
        <SwapRightOutlined size={16} />
        <Typography variant="B1_Bold" color="label.normal">
          징징빌라
        </Typography>
      </HStack>
      <HStack gap="1">
        <Typography variant="B2_Medium" color="label.normal">
          전체 20석
        </Typography>
        <Divider orientation="vertical" height="2.5" color="line.normal" />
        <Typography variant="B2_Medium" color="label.normal">
          잔여 19석
        </Typography>
      </HStack>
    </VStack>
  );
};
