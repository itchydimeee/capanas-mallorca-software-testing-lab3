/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import InventoryPage from "../src/screens/inventory";
import "@testing-library/jest-dom"; 
import { BrowserRouter } from "react-router-dom";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    user: { sub: "user123" },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe("InventoryPage Component", () => {
  const mockUseAuth0 = jest.fn();

  beforeEach(() => {
    mockUseAuth0.mockClear();
  });

  it("renders InventoryPage component with inventory items", async () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { sub: "user123" },
      isLoading: false,
    });

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

    expect(getByText("Your Inventory")).toBeInTheDocument();
  });

});