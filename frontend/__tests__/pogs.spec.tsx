/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PogsForm from '../src/screens/pogs';


jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(() => ({ logout: jest.fn() })),
  }));

jest.mock('../src/components/navigation', () => ({
    __esModule: true,
    default: jest.fn(() => ({ 
      ToReadPogs: jest.fn(),
      ToUserPage: jest.fn(),
    })),
  }));

describe('PogsForm Component', () => {
 beforeEach(() => {
    jest.clearAllMocks();
 });

 it('renders correctly', () => {
    render(
      <BrowserRouter>
        <PogsForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Create Pogs Form')).toBeInTheDocument();
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Ticker Symbol:')).toBeInTheDocument();
    expect(screen.getByText('Price:')).toBeInTheDocument();
    expect(screen.getByText('Color:')).toBeInTheDocument();
 });

 it('handles form submission', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'submission successful' }),
    });

    render(
      <BrowserRouter>
        <PogsForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test Pog' } });
    fireEvent.change(screen.getByLabelText('Ticker Symbol:'), { target: { value: 'TPG' } });
    fireEvent.change(screen.getByLabelText('Price:'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Color:'), { target: { value: 'blue' } });

    window.alert = jest.fn();

  fireEvent.click(screen.getByText('Submit'));

  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('submission successful'));
 });

 it('handles logout', async () => {
    const mockLogout = jest.fn();
    (useAuth0 as jest.Mock).mockReturnValue({
        logout: mockLogout,
    });
      
    render(
      <BrowserRouter>
        <PogsForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
 });
});
