// src/pages/LoginPage.tsx
import { Link } from "react-router";
import LoginForm from "../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm my-4">
      <h1 className="mb-6 text-2xl font-medium tracking-tight">Log in</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-neutral-500">
        No account yet?{" "}
        <Link to="/register" className="underline">
          Register
        </Link>
      </p>
    </div>
  );
}
