import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import {  MemoryRouter } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import useNavigation from '../src/components/navigation'
import CheckoutPage from '../src/screens/checkout'

jest.mock('@auth0/auth0-react')
jest.mock('../src/components/navigation')


describe('CheckoutPage Component', () => {
  beforeEach(() => {
    ; (useAuth0 as jest.Mock).mockReturnValue({
      user: { sub: 'user123' },
      isAuthenticated: true,
      isLoading: false
    })

      ; (useNavigation as jest.Mock).mockReturnValue({
        ToUserPage: jest.fn()
      })

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ totalPrice: 50 })
    })
  })

  it('renders the checkout page with cart item', async () => {
    const mockLocation = {
      state: {
        selectedPogs: [{ id: 1, name: 'Pog 1' , ticker_symbol: 'P1', color: 'Orange', price: 25.0, quantity: 2 }]
      }
    }

    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/checkout', state: mockLocation.state }]}
      >
        <CheckoutPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    expect(screen.getByText('Pog 1')).toBeInTheDocument()
    expect(screen.getByText('Ticker Symbol: P1')).toBeInTheDocument()
    expect(screen.getByText(`Price: ${25.0}`)).toBeInTheDocument()
    expect(screen.getByText('Color: Orange')).toBeInTheDocument()
  })

  it('updates the quantity of an item in the cart', async () => {
    const mockLocation = {
      state: {
        selectedPogs: [{ id: 1, name: 'Pog 1', price: 25.0, quantity: 2 }]
      }
    }

    render(
      <MemoryRouter
        initialEntries={[{ pathname: '/checkout', state: mockLocation.state }]}
      >
        <CheckoutPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument()
    })
    const quantityInput = screen.getByRole('spinbutton', { name: 'Quantity:' });
    fireEvent.change(quantityInput, { target: { value: 2 } });
    expect(quantityInput).toHaveDisplayValue(`${2}`);
  })
})

it('completes the checkout process', async () => {
  
const mockLocation = {
  state: {
    selectedPogs: [{ id: 1, name: 'Pog 1', price: 25.0, quantity: 2 }]
  }
};

  render(
    <MemoryRouter
      initialEntries={[{ pathname: '/checkout', state: mockLocation.state }]}
    >
      <CheckoutPage />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Checkout')).toBeInTheDocument()
  });

  const checkoutButton = screen.getByText('Complete Checkout')
  fireEvent.click(checkoutButton)

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/checkout',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartData: mockLocation.state.selectedPogs,
          userId: 'user123'
        })
      }
    )
  })
});
