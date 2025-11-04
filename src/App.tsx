import { css } from 'styled-system/css'

import './App.css'
import { Flex } from 'styled-system/jsx'

function App() {
  return (
    <Flex direction="column" gap="16px" padding="16px">
      <div className={css({ textStyle: 'H0_Bold' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'H1_Bold' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'H1_Medium' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'H2_Bold' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'H2_Medium' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'B1_Bold' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'B1_Medium' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'B1_Regular' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'B2_Bold' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'B2_Medium' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'B2_Regular' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'C1_Bold' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'C1_Medium' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'C2_Medium' })}>스타일 가이드</div>
      <div className={css({ textStyle: 'C2_Regular' })}>스타일 가이드</div>
    </Flex>
  )
}

export default App
