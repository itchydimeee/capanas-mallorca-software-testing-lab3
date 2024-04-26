import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import UserPage from "../src/screens/user"; // Corrected import
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";

const mockPogs = [
  {
    id: 1,
    name: "Pog 1",
    ticker_symbol: "POG1",
    price: 10.99,
    color: "red",
  },
  {
    id: 2,
    name: "Pog 2",
    ticker_symbol: "POG2",
    price: 15.99,
    color: "blue",
  },
];

// Mock the useAuth0 hook
jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    user: { sub: "user123" },
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: jest.fn(),
  }),
}));

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("UserPage Component", () => {
  it("renders UserPage component", async () => {
    // Mock the axios get method to resolve with mockPogs data
    global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve(mockPogs),
      });

    const { getByText, getAllByText } = render(
      <BrowserRouter>
        <UserPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      mockPogs.forEach((pog) => {
        getByText(pog.name);
        getAllByText(`Ticker Symbol: ${pog.ticker_symbol}`);
        getAllByText(`Price: ${pog.price}`);
      });
    });
  });
});
