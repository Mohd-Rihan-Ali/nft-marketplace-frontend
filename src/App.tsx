import styles from "./styles/App.module.scss";
import { HomePage } from "./pages/HomePage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import MintPage from "./pages/Form";
import Profile from "./pages/Profile";
import NFTDetails from "./pages/NFTDetails";
import Footer from "./components/Footer";
import About from "./pages/About";

const queryClient = new QueryClient();

const Layout: React.FC = () => {
  return (
    <div className={styles.main}>
      <Navbar />
      <div className={styles.contentContainer}>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/mint",
        element: <MintPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/nft/:tokenId",
        element: <NFTDetails />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
