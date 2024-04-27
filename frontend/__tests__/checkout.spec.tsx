/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import CheckoutPage from "../src/screens/checkout"; // Import the correct named export
import { useAuth0 } from "@auth0/auth0-react";
import "@testing-library/jest-dom";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

const mockUseAuth0 = jest.fn();

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

describe("CheckoutPage", () => {
  beforeEach(() => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: mockSelectedPogs } as AxiosResponse<any>);
  });

  it("renders correctly when not authenticated", async () => {
    // Mock the return value of useAuth0 to simulate not authenticated user
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    const { getByText } = render(
      <BrowserRouter>
        <CheckoutPage />
      </BrowserRouter>,
    //   {
    //     // Provide the selectedPogs data in the location.state
    //     // This is necessary for the CheckoutPage to render correctly
    //     wrapper: ({ children }) => (
    //       <BrowserRouter>
    //         <Auth0Provider>
    //           {children}
    //         </Auth0Provider>
    //       </BrowserRouter>
    //     ),
    //     initialEntries: [{ state: { selectedPogs: mockSelectedPogs } }],
    //   }
    );

    await waitFor(() => {
      // Add assertions for the content visible when not authenticated
      expect(getByText("Capanas and Mallorca Pogs Center")).toBeInTheDocument();
      expect(getByText("Please log in")).toBeInTheDocument();
    });

    // Add assertions for the content visible when not authenticated
    // expect(screen.getByText("Capanas and Mallorca Pogs Center")).toBeInTheDocument();
    // expect(screen.getByText("Please log in")).toBeInTheDocument();
  });
});
