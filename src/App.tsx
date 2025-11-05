import { Flex, styled } from 'styled-system/jsx'
import { Text } from './ui-lib/components/Text'

function App() {
  return (
    <Flex direction="column" gap="16px">
      <styled.img src="/logo.svg" alt="Bikini Transport" />
      <Text variant="H0_Bold" textAlign="center">
        Hello, Bikini Transport
      </Text>
    </Flex>
  )
}

export default App
