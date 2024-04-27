import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import PogItem from '../src/components/pogsItem'
import axios from 'axios'

jest.mock('axios')
jest.mock('../src/components/navigation', () => ({
  __esModule: true,
  default: jest.fn(() => ({ ToCreatePogs: jest.fn() }))
}))
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

describe('PogsList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(axios.get as jest.Mock).mockResolvedValue({ data: mockPogs })
  })

  it('renders pog items', async () => {
    render(
      <PogItem
        pog={{
          id: 0,
          name: '',
          ticker_symbol: '',
          price: 0,
          color: ''
        }}
        setEditingPog={function (
          pog: {
            id: number
            name: string
            ticker_symbol: string
            price: number
            color: string
          } | null
        ): void {
          throw new Error('Function not implemented.')
        }}
        handleDeletePog={function (pogId: number): void {
          throw new Error('Function not implemented.')
        }}
      />
    )

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1)
    })

    const pogItems = screen.getAllByTestId('pog-item')

    pogItems.forEach(pogItem => {
      expect(pogItem).toHaveTextContent('Name:')
      expect(pogItem).toHaveTextContent('Ticker Symbol:')
      expect(pogItem).toHaveTextContent('Price:')
      expect(pogItem).toHaveTextContent('Color:')
    })
  })
  it('should render update and delete buttons for each Pog', async () => {
    ;(axios.put as jest.Mock).mockResolvedValueOnce({})

    render(
      <BrowserRouter>
        <PogItem
          pog={{
            id: 0,
            name: '',
            ticker_symbol: '',
            price: 0,
            color: ''
          }}
          setEditingPog={function (
            pog: {
              id: number
              name: string
              ticker_symbol: string
              price: number
              color: string
            } | null
          ): void {
            throw new Error('Function not implemented.')
          }}
          handleDeletePog={function (pogId: number): void {
            throw new Error('Function not implemented.')
          }}
        />
      </BrowserRouter>
    )
    const updateButtons = screen.getAllByText('Update')
    const deleteButtons = screen.getAllByText('Delete')

    updateButtons.forEach(button => expect(button).toBeInTheDocument())
    deleteButtons.forEach(button => expect(button).toBeInTheDocument())
  })
})
let editingPog = null

const setEditingPog = pog => {
  editingPog = pog
}
it('should open the edit modal when update button is clicked', async () => {
  render(
    <PogItem
      pog={{
        id: 1,
        name: 'Pog 1',
        ticker_symbol: 'P1',
        price: 10,
        color: 'Red'
      }}
      setEditingPog={setEditingPog}
      handleDeletePog={function (pogId: number): void {
        throw new Error('Function not implemented.')
      }}
    />
  )

  const updateButton = await screen.findByTestId(`update-button-1`)
  fireEvent.click(updateButton)

  expect(editingPog).toEqual({
    id: 1,
    name: 'Pog 1',
    ticker_symbol: 'P1',
    price: 10,
    color: 'Red'
  })
})
it('should delete the Pog when delete button is clicked', async () => {
  const handleDeletePog = jest.fn();

  render(
    <PogItem
      pog={{
        id: 1,
        name: 'Pog 1',
        ticker_symbol: 'P1',
        price: 10,
        color: 'Red'
      }}
      setEditingPog={function (pog: { id: number; name: string; ticker_symbol: string; price: number; color: string } | null): void {
        throw new Error('Function not implemented.')
      }}
      handleDeletePog={handleDeletePog}
    />
  );

  const deleteButton = await screen.findByRole('button', { name: 'Delete' });
  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(handleDeletePog).toHaveBeenCalledTimes(1);
    expect(handleDeletePog).toHaveBeenCalledWith(1);
  });
});
