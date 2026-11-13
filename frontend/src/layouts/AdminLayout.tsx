// src/layouts/AdminLayout.tsx
import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { label: "Dashboard", to: "/admin/" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Products", to: "/admin/products" },
  { label: "Categories", to: "/admin/categories" },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin/categories" className="text-xl font-bold">
            Admin Panel
          </Link>

          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? "text-black" : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name ?? "Admin"}
            </span>

            <Link to="/" className="text-sm text-gray-600 hover:text-black">
              Back to Store
            </Link>

            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
