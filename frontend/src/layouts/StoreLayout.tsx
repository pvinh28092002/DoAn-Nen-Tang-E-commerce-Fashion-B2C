import { Link, Outlet } from "react-router";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/products" },
  { label: "New arrivals", to: "/products?sort=newest" },
];

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-white text-[#20201e]">
      <div className="bg-[#20201e] px-4 py-2 text-center text-xs tracking-wide text-white">
        FREE SHIPPING ON ORDERS OVER 1,000,000 VND
      </div>

      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            to="/"
            className="font-display text-2xl font-extrabold tracking-[-0.06em]"
            aria-label="Vinh home"
          >
            VINH<span className="text-neutral-400">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-neutral-600 transition hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 text-sm font-medium">
            <Link
              to="/login"
              className="hidden transition hover:text-neutral-500 sm:block"
            >
              Account
            </Link>

            <Link
              to="/cart"
              className="transition hover:text-neutral-500"
              aria-label="Shopping cart"
            >
              Bag
            </Link>
          </div>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex gap-6 overflow-x-auto border-t border-neutral-100 px-5 py-3 md:hidden"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="shrink-0 text-sm text-neutral-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 bg-[#20201e] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-2 md:px-8">
          <div>
            <Link
              to="/"
              className="font-display text-2xl font-extrabold tracking-[-0.06em]"
            >
              VINH.
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-400">
              Everyday essentials, thoughtfully selected. Simple style, made for
              everyday life.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm font-semibold">Need help?</p>
            <p className="mt-2 text-sm text-neutral-400">
              Contact and customer support information coming soon.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} VINH. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
