"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      setError("Invalid credentials");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 rounded bg-white p-6 shadow"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-black py-2 text-white">Login</button>
      </form>
    </main>
  );
}
