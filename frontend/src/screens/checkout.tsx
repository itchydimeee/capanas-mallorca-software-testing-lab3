// File: __tests__/checkout.spec.tsx

import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import CheckoutPage from "../../src/screens/checkout";
import { Auth0Provider, Auth0ProviderOptions } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

const mockUser = {
  sub: "user123",
  name: "Test User",
  email: "test@example.com",
  picture: "https://example.com/profile.jpg"
};

const mockSelectedPogs = [
  {
    id: 1,
    name: "Pog 1",
    ticker_symbol: "POG1",
    price: 10.99,
    color: "red",
    quantity: 1,
  },
  {
    id: 2,
    name: "Pog 2",
    ticker_symbol: "POG2",
    price: 15.99,
    color: "blue",
    quantity: 1,
  },
];

const Auth0ProviderWithInitialState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth0ProviderOptions: Auth0ProviderOptions = {
    domain: "your-auth0-domain",
    clientId: "your-auth0-client-id",
    redirectUri: window.location.origin,
    audience: "your-auth0-audience",
    scope: "openid profile email",
  };

  return (
    <Auth0Provider {...auth0ProviderOptions} initialState={{
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    }}>
      {children}
    </Auth0Provider>
  );
};

describe("CheckoutPage Component", () => {
  beforeEach(() => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({
      data: mockSelectedPogs
    });
  });

  it("renders CheckoutPage component", async () => {
    render(
      <BrowserRouter>
        <Auth0ProviderWithInitialState>
          <CheckoutPage />
        </Auth0ProviderWithInitialState>
      </BrowserRouter>
    );

    // Your test assertions...
  });
});
