import React from "react";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Pages/Login";
import EmailVerify from "./Pages/EmailVerify";
import ResetPassword from "./Pages/ResetPassword";
import AppLayout from "./Layout/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/email-verify",
          element: <EmailVerify />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router}>
        <ToastContainer position="top-center"/>
      </RouterProvider>
    </>
  );
};

export default App;
