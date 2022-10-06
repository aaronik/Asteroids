import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HostMultiPlayerGame from "./routes/host";
import Menu from "./routes/menu";
import MultiPlayerGameGuest from "./routes/guest";
import SinglePlayerGame from "./routes/single";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />
  },
  {
    path: '/single',
    element: <SinglePlayerGame />
  },
  {
    path: 'host',
    element: <HostMultiPlayerGame />
  },
  {
    path: 'guest',
    element: <MultiPlayerGameGuest />
  },
])

export default function App() {

  return (
    <RouterProvider router={router} />
  )
}
