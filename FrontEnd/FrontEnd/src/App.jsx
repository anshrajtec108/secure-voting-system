import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import OtpRequest from './components/user/OtpRequest';
import OtpVerify from './components/user/OtpVerify';
import Dashboard from './components/user/Dashboard';
import VotePage from './components/user/VotePage';
import OtpRequestOfficer from './components/ElectionOfficer/OtpRequestOfficer';
import OtpVerifyOfficer from './components/ElectionOfficer/OtpVerifyOfficer';
import ProtectedRoute from './services/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <OtpRequest />,
  },
  {
    path: '/otp-verify',
    element: <OtpVerify />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute Component={Dashboard}></ProtectedRoute>,
  },
  {
    path: '/vote',
    element: <VotePage />,
  },
  {
    path: '/election-officer/otp-request',
    element: <OtpRequestOfficer />,
  },
  {
    path: '/election-officer/otp-verify',
    element: <OtpVerifyOfficer />,
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
