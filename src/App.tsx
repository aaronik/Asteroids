import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HostMultiPlayerGame from "./routes/host"
import Menu from "./routes/menu"
import MultiPlayerGameGuest from "./routes/guest"
import SinglePlayerGame from "./routes/single"
import NoHost from "./routes/noHost"
import Lost from "./routes/lost"
import NetworkInfoDropdown from "./components/network-info-dropdown"
import { network } from "./network"

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />
  },
  {
    path: '/single',
    element: <SinglePlayerGame />
  },
  {
    path: '/host',
    element: <HostMultiPlayerGame />
  },
  {
    path: '/guest',
    element: <MultiPlayerGameGuest />
  },
  {
    path: '/nohost',
    element: <NoHost />
  },
  {
    path: '/lost',
    element: <Lost />
  },
])

export default function App() {

  return (
    <div>
      <NetworkInfoDropdown network={network} />
      <RouterProvider router={router} />
    </div>
  )
}
