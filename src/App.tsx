import { Flex } from 'styled-system/jsx'
import { Tabs } from './ui-lib/components/Tabs'

function App() {
  return (
    <Flex direction="column" gap="16px">
      <Tabs.Root defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">탭 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">탭 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">내용 1</Tabs.Content>
        <Tabs.Content value="tab2">내용 2</Tabs.Content>
      </Tabs.Root>
    </Flex>
  )
}

export default App
