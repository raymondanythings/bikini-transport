import { PaymentPage } from '@/pages/PaymentPage'
import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWith } from './render-with'

describe('payment', () => {
  it('[테스트] 결제 화면을 띄운다', () => {
    renderWith(<PaymentPage />, { route: '/payment' })

    expect(screen.getByText('결제')).toBeInTheDocument()

    expect(screen.getByText(/환승 \d+회/)).toBeInTheDocument()
  })
})
