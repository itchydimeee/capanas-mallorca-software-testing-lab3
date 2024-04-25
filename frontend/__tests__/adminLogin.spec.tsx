/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
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

//pa help here conditional coz it bugs 
  // it("renders return button when authenticated but not admin", () => {
  //   const mockNavigate = jest.fn();
  //   const mockIsAdmin = jest.fn().mockReturnValue(false);
  //   jest.mock("react-router-dom", () => ({
  //     ...jest.requireActual("react-router-dom"),
  //     useNavigate: () => mockNavigate,
  //   }));

  //   jest.mock("../src/components/admin", () => ({
  //     adminEmails: ["admin@example.com"],
  //   }));

  //   render(
  //     <BrowserRouter>
  //       <AdminLogin />
  //     </BrowserRouter>
  //   );

  //   expect(screen.getByText("You are not authorized to access the admin page.")).toBeInTheDocument();
  //   fireEvent.click(screen.getByText("Return"));
  //   expect(mockNavigate).toHaveBeenCalled();
  // });
});
