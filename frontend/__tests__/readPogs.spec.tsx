import React from 'react'
import {
  render,
  fireEvent,
  waitFor,
  screen
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import PogsList from '../src/screens/readPogs'
import axios from 'axios'

jest.mock('axios')
jest.mock('../src/components/navigation', () => ({
  __esModule: true,
  default: jest.fn(() => ({ ToCreatePogs: jest.fn() }))
}))

describe('PogsList Component', () => {
  const mockPogs = [
    {
      id: 1,
      name: 'Pog 1',
      ticker_symbol: 'P1',
      price: 10,
      color: 'Red'
    },
    {
      id: 2,
      name: 'Pog 2',
      ticker_symbol: 'P2',
      price: 20,
      color: 'Blue'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(axios.get as jest.Mock).mockResolvedValue({ data: mockPogs })
  })
  it('updates Pog price on button click', async () => {
    ;(axios.put as jest.Mock).mockResolvedValueOnce({})

    render(
      <BrowserRouter>
        <PogsList />
      </BrowserRouter>
    )
    fireEvent.click(screen.getByText('Random Price'))
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        'http://localhost:3000/pogs-update-price'
      )
    })
    await waitFor(() => {
      expect(screen.getByText('Price Updated')).toBeInTheDocument()
    })
  })
})
