import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import axios, { AxiosResponse } from "axios";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import SpecificExportName from "../src/screens/checkout"; // Make sure the path is correct
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(), // Mocking the useAuth0 hook
}));

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
    axios.get = jest.fn().mockResolvedValueOnce({ data: mockSelectedPogs } as AxiosResponse<any>);
  });

  it("renders correctly when not authenticated", async () => {
    // Mock the return value of useAuth0 to simulate not authenticated user
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <Auth0Provider
          domain="dev-eu8aiywpss3vtys4.us.auth0.com"
          clientId="SF07cvV5Glzax1ieezv28gT0q8bSMMJn"
        >
          <SpecificExportName /> {/* Render the specific export */}
        </Auth0Provider>
      </BrowserRouter>
    );

    // Add assertions for the content visible when not authenticated
    expect(screen.getByText("Capanas and Mallorca Pogs Center")).toBeInTheDocument();
    expect(screen.getByText("Please log in")).toBeInTheDocument();
  });
});
