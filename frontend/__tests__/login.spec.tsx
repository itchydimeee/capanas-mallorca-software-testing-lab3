/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginForm from "../src/screens/login";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn().mockReturnValue({
    user: { sub: "user123" },
    isAuthenticated: false,
    isLoading: false,
    loginWithRedirect: jest.fn(),
  }),
}));

describe("LoginForm Component", () => {
  it("renders LoginForm component", () => {
    const { getByText } = render(
      <Router>
        <LoginForm />
      </Router>
    );
    expect(getByText("Capanas and Mallorca Pogs Center")).toBeInTheDocument();
    expect(getByText("Log In")).toBeInTheDocument();
  });

  it("calls loginWithRedirect when Log In button is clicked", async () => {
    const { getByText } = render(
      <Router>
        <LoginForm />
      </Router>
    );
    fireEvent.click(getByText("Log In"));
    await waitFor(() =>
      expect(useAuth0().loginWithRedirect).toHaveBeenCalledTimes(1)
    );
  });

  it('displays loading spinner if isLoading is true', () => {
    (useAuth0 as jest.Mock).mockReturnValueOnce({
      isAuthenticated: false,
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
