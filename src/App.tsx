import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import { filterByCategory, filterByCollection } from "./lib/filters";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import { Login, Register } from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import Policies from "./pages/Policies";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/men",
        element: <Listing title="Men" subtitle="Shop the collection" filter={filterByCategory("men")} />,
      },
      {
        path: "/women",
        element: <Listing title="Women" subtitle="Shop the collection" filter={filterByCategory("women")} />,
      },
      {
        path: "/new",
        element: <Listing title="New Arrivals" subtitle="Just dropped" filter={filterByCollection("new")} />,
      },
      {
        path: "/best",
        element: <Listing title="Best Sellers" subtitle="Most loved" filter={filterByCollection("best")} />,
      },
      {
        path: "/sale",
        element: <Listing title="Sale" subtitle="Up to 30% off" filter={filterByCollection("sale")} />,
      },
      {
        path: "/search",
        element: <Listing title="Search" subtitle="All results" />,
      },
      { path: "/product/:slug", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/order-confirmation/:id", element: <OrderConfirmation /> },
      { path: "/account", element: <Account /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/policies/:slug", element: <Policies /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
