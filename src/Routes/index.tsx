// src/Routes/index.tsx  yoki src/main.tsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserInterface from '../Layouts/UserInterface';
import Menu from '../pages/Menu';
// import Dashboard from '../pages/Dashboard';  // hali yo'q bo'lsa, komment qiling

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <UserInterface>
        <Menu />
      </UserInterface>
    ),
  },
  {
    path: '/menu',
    element: (
      <UserInterface>
        <Menu />
      </UserInterface>
    ),
  },
  // Agar Dashboard hali tayyor bo'lmasa, shu qatorni o'chirib tashlang yoki komment qiling
  // {
  //   path: '/dashboard',
  //   element: (
  //     <UserInterface>
  //       <Dashboard />
  //     </UserInterface>
  //   ),
  // },
]);

function Routes() {
  return <RouterProvider router={router} />;
}

export default Routes;