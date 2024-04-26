import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import axios, { AxiosResponse } from "axios"; // Importing AxiosResponse
import RenderPogs from "../src/screens/renderPogs";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Importing BrowserRouter as Router
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    user: { sub: "user123" },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe("RenderPogs Component", () => {
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

  beforeEach(() => {
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({ data: mockPogs } as AxiosResponse<any>);
  });

  it("renders RenderPogs component", async () => {
    render(<RenderPogs />);
    await waitFor(() => {
      expect(screen.getByText("Pogs List")).toBeInTheDocument();
    });
  });


  // buggy part
  it("displays loading spinner if isLoading is true", () => {
    // Mocking useAuth0 to return isLoading as true
    (useAuth0 as jest.Mock).mockReturnValueOnce({
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <Router>
        <RenderPogs />
      </Router>
    );
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

});
