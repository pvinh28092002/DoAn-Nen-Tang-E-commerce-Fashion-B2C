// App.tsx
import { Navigate, Route, Routes } from "react-router";

import StoreLayout from "./layouts/StoreLayout";
import AdminLayout from "./layouts/AdminLayout";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsListingPage from "./pages/ProductsListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import ProtectedRoute, {
  AdminProtectedRoute,
} from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Store */}
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="products" element={<ProductsListingPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route
            path="orders/:orderId/success"
            element={<OrderSuccessPage />}
          />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<>Products pending</>} />
          <Route path="orders" element={<>Orders pending</>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
