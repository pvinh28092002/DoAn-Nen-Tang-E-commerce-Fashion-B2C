import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
        Error 404
      </p>

      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
        Page not found
      </h1>

      <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
        The page you're looking for doesn't exist or may have moved.
      </p>

      <Link
        to="/"
        className="mt-7 bg-[#20201e] px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700"
      >
        Back to home
      </Link>
    </section>
  );
}
