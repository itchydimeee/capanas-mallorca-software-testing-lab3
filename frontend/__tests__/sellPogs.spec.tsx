import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import InventoryPage from '../src/screens/inventory';
import useNavigation from '../src/components/navigation';

jest.mock('@auth0/auth0-react');
jest.mock('../src/components/navigation');

describe('InventoryPage Component', () => {
  const mockInventory = [
    {
      id: 1,
      quantity: 5,
      pog: {
        id: 1,
        name: 'Pog 1',
        ticker_symbol: 'P1',
        price: 10,
        color: 'Red',
      },
    },
    {
      id: 2,
      quantity: 3,
      pog: {
        id: 2,
        name: 'Pog 2',
        ticker_symbol: 'P2',
        price: 20,
        color: 'Blue',
      },
    },
  ];

  beforeEach(() => {
    (useAuth0 as jest.Mock).mockReturnValue({
      user: { sub: 'user123' },
      isAuthenticated: true,
      isLoading: false,
    });

    (useNavigation as jest.Mock).mockReturnValue({
      ToUserPage: jest.fn(),
    });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockInventory),
    });
  });

  it('allows the user to sell a POG', async () => {
    render(
      <BrowserRouter>
        <InventoryPage />
      </BrowserRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Pog 1')).toBeInTheDocument();
    });
  
    // Sell 2 Pog 1s
    const sellButtons = screen.getAllByText('Sell');
    fireEvent.click(sellButtons[0]);
    fireEvent.change(screen.getByLabelText('Quantity to sell:'), { target: { value: '2' } });
    fireEvent.click(screen.getByText('Confirm Sell'));
  
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user123',
          pogId: 1,
          quantityToSell: 2,
        }),
      });
    });
  });
});