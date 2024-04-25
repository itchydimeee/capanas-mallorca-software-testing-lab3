/* eslint-disable testing-library/prefer-screen-queries */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import LoginForm from '../src/screens/login';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('@auth0/auth0-react');

describe('LoginForm Component', () => {
  const mockLoginWithRedirect = jest.fn();
  const mockIsAuthenticated = false;
  const mockIsLoading = false;

  beforeEach(() => {
    jest.clearAllMocks();
    // (useAuth0 as jest.Mock).mockReturnValue({
    //   loginWithRedirect: mockLoginWithRedirect,
    //   isAuthenticated: mockIsAuthenticated,
    //   isLoading: mockIsLoading,
    // });
  });

  it('renders LoginForm component', () => {
    const { getByText } = render(
        <Router>
            <LoginForm />
        </Router>
    );
    expect(getByText('Capanas and Mallorca Pogs Center')).toBeInTheDocument();
    expect(getByText('Log In')).toBeInTheDocument();
  });

  it('calls loginWithRedirect when Log In button is clicked', async () => {
    const { getByText } = render(<LoginForm />);
    fireEvent.click(getByText('Log In'));
    await waitFor(() => expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1));
  });

  it('redirects to /user if isAuthenticated is true', async () => {
    (useAuth0 as jest.Mock).mockReturnValueOnce({
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: true,
      isLoading: mockIsLoading,
    });

    render(<LoginForm />);
    await waitFor(() => expect(window.location.replace).toHaveBeenCalledWith('/user'));
  });

  it('displays loading spinner if isLoading is true', () => {
    (useAuth0 as jest.Mock).mockReturnValueOnce({
      loginWithRedirect: mockLoginWithRedirect,
      isAuthenticated: mockIsAuthenticated,
      isLoading: true,
    });

    const { getByTestId } = render(
        <Router>
            <LoginForm />
        </Router>
    );
    expect(getByTestId('spinner')).toBeInTheDocument();
  });
});

