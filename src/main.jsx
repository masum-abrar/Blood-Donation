import * as React from "react";
import * as ReactDOM from "react-dom/client";
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import router from './Routers/Router.jsx';
import { HelmetProvider } from "react-helmet-async";
import AuthProviders from "./providers/AuthProviders.jsx";

import { QueryClientProvider,QueryClient } from "@tanstack/react-query";



const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <React.StrictMode>

    <AuthProviders>
  <HelmetProvider>
<QueryClientProvider client={queryClient}>
<RouterProvider router={router} />
</QueryClientProvider>
  </HelmetProvider>
  </AuthProviders>
  </React.StrictMode>
);

