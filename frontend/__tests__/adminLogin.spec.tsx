/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminLogin from "../src/screens/adminLogin";
import "@testing-library/jest-dom";


jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

describe("AdminLogin Component", () => {
  const mockUseAuth0 = jest.fn();

  beforeEach(() => {
    mockUseAuth0.mockClear();
  });

  it("renders correctly when not authenticated", () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    const { getByText } = render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    expect(getByText("Capanas and Mallorca Pogs Center")).toBeInTheDocument();
    expect(getByText("Please log in")).toBeInTheDocument();
  });
});
