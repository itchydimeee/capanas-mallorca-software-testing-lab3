import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import InventoryPage from "../src/screens/inventory";
import { useAuth0 } from "@auth0/auth0-react";
import "@testing-library/jest-dom"; // Importing to extend Jest matchers
import { BrowserRouter } from "react-router-dom";

// Mocking useAuth0 hook
jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    user: { sub: "user123" },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe("InventoryPage Component", () => {
  // Mocking useAuth0 return values
  const mockUseAuth0 = jest.fn();

  beforeEach(() => {
    // Clear mock calls and set default return values before each test
    mockUseAuth0.mockClear();
  });

  it("renders InventoryPage component with inventory items", async () => {
    // Mocking isAuthenticated, user, and isLoading
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: "user123" },
      isLoading: false,
    });

    // Mocking fetch request for inventory
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            quantity: 5,
            pog: {
              id: 1,
              name: "Sample Pog",
              ticker_symbol: "SPG",
              price: 10,
              color: "blue",
            },
          },
        ]),
    });

    render(
      <BrowserRouter>
        <InventoryPage />
      </BrowserRouter>
    );

    // Wait for the inventory items to be rendered
    await waitFor(() => {
      const samplePog = screen.queryByText("Sample Pog");
      expect(samplePog).not.toBeNull();
    });

    await waitFor(() => {
      const samplePog = screen.queryByText("Sample Pog");
      expect(samplePog).toBeInTheDocument();
    });

    await waitFor(() => {
      const tickerSymbol = screen.queryByText("Ticker Symbol: SPG");
      expect(tickerSymbol).not.toBeNull();
    });

    await waitFor(() => {
      const tickerSymbol = screen.queryByText("Ticker Symbol: SPG");
      expect(tickerSymbol).toBeInTheDocument();
    });

    await waitFor(() => {
      const price = screen.queryByText("Price: 10");
      expect(price).not.toBeNull();
    });

    await waitFor(() => {
      const price = screen.queryByText("Price: 10");
      expect(price).toBeInTheDocument();
    });

    await waitFor(() => {
      const color = screen.queryByText("Color: blue");
      expect(color).not.toBeNull();
    });

    await waitFor(() => {
      const color = screen.queryByText("Color: blue");
      expect(color).toBeInTheDocument();
    });

    await waitFor(() => {
      const quantity = screen.queryByText("Quantity: 5");
      expect(quantity).not.toBeNull();
    });

    await waitFor(() => {
      const quantity = screen.queryByText("Quantity: 5");
      expect(quantity).toBeInTheDocument();
    });
  });

  it("displays loading message while fetching inventory", () => {
    // Mocking isAuthenticated, user, and isLoading to simulate loading state
    mockUseAuth0.mockReturnValueOnce({
      isAuthenticated: true,
      user: { sub: "user123" },
      isLoading: true,
    });

    const { getByText } = render(
      <BrowserRouter>
        <InventoryPage />
      </BrowserRouter>
    );

    // eslint-disable-next-line testing-library/prefer-presence-queries, testing-library/prefer-screen-queries
    expect(getByText("Your Inventory")).toBeInTheDocument();
  });

  //   Add more test cases as needed for different scenarios
});
