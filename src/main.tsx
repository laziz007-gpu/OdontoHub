import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import { router } from "./Routes";
import "./index.css"
import '../src/i18n.js'


const client = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={client}>
     <RouterProvider router={router}/>
  </QueryClientProvider>
)
