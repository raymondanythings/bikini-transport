import { ark } from '@ark-ui/react';
import { useState } from 'react';
import { Box, Divider, Flex, Spacer } from 'styled-system/jsx';
import { BottomSheet } from '@/ui-lib/components/BottomSheet';
import { SearchOutlined } from '@/ui-lib/components/Icon';
import { Input } from '@/ui-lib/components/Input';
import { Typography } from '@/ui-lib/components/Typography';

export const StationSearchBottomSheet = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BottomSheet
      open={false}
      header={
        <Flex>
          <BottomSheet.Header>정류장 검색</BottomSheet.Header>
        </Flex>
      }
    >
      <Box pt={2} px={5} pb={5} overflow="hidden">
        <Input
          placeholder="버스 정류장을 검색해주세요"
          icon={<SearchOutlined />}
          allowClear
          value={searchQuery}
          onChange={event => {
            setSearchQuery(event.target.value);
          }}
        />

        <Spacer height={2} />

        <Flex direction="column" as="ul" height="360px" overflowY="auto">
          <Box as="li" p={4}>
            <ark.button>
              <Typography variant="B1_Medium" color="label.normal">
                버스 정류장 이름1
              </Typography>
            </ark.button>
          </Box>
          <Divider color="line.alternative" />

          <Box as="li" p={4}>
            <ark.button>
              <Typography variant="B1_Medium" color="label.normal">
                버스 정류장 이름2
              </Typography>
            </ark.button>
          </Box>
          <Divider color="line.alternative" />

          <Box as="li" p={4}>
            <ark.button>
              <Typography variant="B1_Medium" color="label.normal">
                버스 정류장 이름3
              </Typography>
            </ark.button>
          </Box>
          <Divider color="line.alternative" />

          <Box as="li" p={4}>
            <ark.button>
              <Typography variant="B1_Medium" color="label.normal">
                버스 정류장 이름4
              </Typography>
            </ark.button>
          </Box>
          <Divider color="line.alternative" />

          <Box as="li" p={4}>
            <ark.button>
              <Typography variant="B1_Medium" color="label.normal">
                버스 정류장 이름5
              </Typography>
            </ark.button>
          </Box>
          <Divider color="line.alternative" />
        </Flex>
      </Box>
    </BottomSheet>
  );
};
