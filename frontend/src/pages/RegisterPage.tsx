// src/pages/LoginPage.tsx
import { Link } from "react-router";
import RegisterForm from "../features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-sm my-4">
      <h1 className="mb-6 text-2xl font-medium tracking-tight">Register</h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-neutral-500">
        Already got an account?{" "}
        <Link to="/login" className="underline">
          Login
        </Link>
      </p>
    </div>
  );
}
