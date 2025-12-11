import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Search from "./Search/Search";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home/Home";
import { createTheme, ThemeProvider } from "@mui/material";
import MyBookings from "./MyBookings/MyBookings";
import FindDoctors from "./pages/FindDoctors/FindDoctors";
import Medicines from "./pages/Medicines/Medicines";
import Surgeries from "./pages/Surgeries/Surgeries";
import ProviderSoftware from "./pages/ProviderSoftware/ProviderSoftware";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { DoctorsProvider } from "./context/DoctorsContext";
import { BookingsProvider } from "./context/BookingsContext";
import { UIProvider } from "./context/UIContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "my-bookings",
        element: <MyBookings />,
      },
      {
        path: "find-doctors",
        element: <FindDoctors />,
      },
      {
        path: "medicines",
        element: <Medicines />,
      },
      {
        path: "surgeries",
        element: <Surgeries />,
      },
      {
        path: "provider-software",
        element: <ProviderSoftware />,
      },
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
]);

//Theme object created using createTheme to override the CSS styles of MUI library
export const theme = createTheme({
  typography: {
    fontFamily: "Poppins , sans-serif",
  },
  palette: {
    primary: {
      main: "#2AA7FF",
      green: "#00A500",
      secondary: "#1B3C74",
    },
    secondary: {
      main: "#ff5722",
      light: "#ff8a50",
      dark: "#c41c00",
      contrastText: "#fff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
        contained: {
          color: "#fff",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          width: "90%",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: "#000000",
          fontSize: "56px",
          fontWeight: "700",
        },
        h2: {
          color: "#1B3C74",
          fontWeight: "600",
          fontSize: "48px",
          lineHeight: 1.2,
        },
        h3: {
          color: "#102851",
          fontSize: "30px",
          fontWeight: "500",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: "#FAFBFE",
          borderRadius: "8px",
          color: "#ABB6C7",
          "& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#F0F0F0",
            },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          background: "#FAFBFE",
          borderRadius: "8px",
          color: "#ABB6C7",
          "& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#F0F0F0",
            },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

theme.typography.h2 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
  },
};

theme.typography.h1 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "36px",
  },
};

theme.typography.h3 = {
  [theme.breakpoints.down("sm")]: {
    fontSize: "22px",
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <DoctorsProvider>
          <BookingsProvider>
            <UIProvider>
              <CartProvider>
                <RouterProvider router={router} />
              </CartProvider>
            </UIProvider>
          </BookingsProvider>
        </DoctorsProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);