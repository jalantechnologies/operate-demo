import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage, NotFound } from 'frontend/pages';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '*', element: <NotFound /> },
]);

export const AppRoutes = () => <RouterProvider router={router} />;
