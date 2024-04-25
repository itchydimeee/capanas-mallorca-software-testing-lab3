/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PogsForm from '../src/screens/pogs';


// Mocking useAuth0 and useNavigation hooks
jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(() => ({ logout: jest.fn() })),
  }));

jest.mock('../src/components/navigation', () => ({
    __esModule: true, // Add this line
    default: jest.fn(() => ({ // Add this line
      ToReadPogs: jest.fn(),
      ToUserPage: jest.fn(),
    })),
  }));

describe('PogsForm Component', () => {
 beforeEach(() => {
    // Reset all mocks before each test
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
    // Mock fetch to simulate API call
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'submission successful' }),
    });

    render(
      <BrowserRouter>
        <PogsForm />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: 'Test Pog' } });
    fireEvent.change(screen.getByLabelText('Ticker Symbol:'), { target: { value: 'TPG' } });
    fireEvent.change(screen.getByLabelText('Price:'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Color:'), { target: { value: 'blue' } });

    window.alert = jest.fn();

  fireEvent.click(screen.getByText('Submit'));

  // Wait for the alert to appear
  await waitFor(() => expect(window.alert).toHaveBeenCalledWith('submission successful'));
 });

 it('handles logout', async () => {
    // Define mockLogout in the scope of this test
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

    // Wait for the logout function to be called
    await waitFor(() => expect(mockLogout).toHaveBeenCalled());
 });
});
