import { Link } from "react-router";

const categories = [
  {
    name: "Everyday essentials",
    description: "The pieces you reach for most.",
    number: "01",
  },
  {
    name: "Modern classics",
    description: "Timeless styles, easy to wear.",
    number: "02",
  },
  {
    name: "New season",
    description: "A fresh perspective on everyday style.",
    number: "03",
  },
];

const products = [
  {
    name: "Essential Cotton Tee",
    category: "Everyday essentials",
    price: "299,000",
    color: "bg-[#e8e3da]",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Relaxed Everyday Shirt",
    category: "Modern classics",
    price: "499,000",
    color: "bg-[#e5e5e0]",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Minimal Daily Wear",
    category: "New season",
    price: "399,000",
    color: "bg-[#e9e1d8]",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Classic Neutral Look",
    category: "Modern classics",
    price: "549,000",
    color: "bg-[#e4e0db]",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-2 md:items-center md:gap-12 md:px-8 md:py-16">
        <div className="order-2 py-4 md:order-1 md:py-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Everyday style, redefined
          </p>

          <h1 className="max-w-xl font-display text-5xl font-semibold leading-[1.08] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Less, but
            <br />
            <span className="text-neutral-400">better.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-neutral-600">
            Discover thoughtfully selected clothing designed to fit effortlessly
            into your everyday wardrobe.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center bg-[#20201e] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              Explore collection <span className="ml-3">↗</span>
            </Link>

            <a
              href="#categories"
              className="inline-flex items-center justify-center border border-neutral-300 px-7 py-3.5 text-sm font-medium transition hover:border-neutral-800"
            >
              Discover more
            </a>
          </div>

          <div className="mt-12 flex gap-8 border-t border-neutral-200 pt-6">
            <div>
              <p className="font-display text-xl font-semibold">Everyday</p>
              <p className="mt-1 text-xs text-neutral-500">Versatile pieces</p>
            </div>
            <div>
              <p className="font-display text-xl font-semibold">Timeless</p>
              <p className="mt-1 text-xs text-neutral-500">Considered design</p>
            </div>
          </div>
        </div>

        <div className="order-1 min-h-[340px] overflow-hidden bg-[#eeeae4] md:order-2 md:min-h-[540px]">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85"
            alt="Contemporary everyday fashion collection"
            className="h-full min-h-[340px] w-full object-cover md:min-h-[540px]"
          />
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="border-y border-neutral-200 bg-[#faf9f7]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Find your style
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Shop by collection
              </h2>
            </div>

            <Link
              to="/products"
              className="text-sm font-medium underline underline-offset-4"
            >
              View all products
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.number}
                to="/products"
                className="group border border-neutral-200 bg-white p-6 transition hover:border-neutral-500 md:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    {category.number}
                  </span>
                  <span className="transition-transform group-hover:translate-x-1">
                    ↗
                  </span>
                </div>

                <h3 className="mt-10 font-display text-xl font-semibold tracking-tight">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              The edit
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
              Everyday favourites
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden text-sm font-medium underline underline-offset-4 sm:block"
          >
            Shop all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
          {products.map((product) => (
            <article key={product.name} className="group min-w-0">
              <Link
                to="/products"
                className={`relative block aspect-[3/4] overflow-hidden ${product.color}`}
                aria-label={`Explore ${product.name}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm transition group-hover:bg-[#20201e] group-hover:text-white">
                  ↗
                </span>
              </Link>

              <p className="mt-4 text-xs text-neutral-500">
                {product.category}
              </p>
              <h3 className="mt-1 text-sm font-medium">{product.name}</h3>
              <p className="mt-2 text-sm text-neutral-700">
                {product.price} VND
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Closing banner */}
      <section className="mx-5 mb-16 bg-[#eeece7] px-6 py-14 text-center md:mx-8 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          A more considered wardrobe
        </p>

        <h2 className="mx-auto mt-4 max-w-xl font-display text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
          Find your everyday essentials.
        </h2>

        <Link
          to="/products"
          className="mt-7 inline-flex bg-[#20201e] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Explore the collection
        </Link>
      </section>
    </>
  );
}
