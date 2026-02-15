"use client";

import Image from "next/image";
import style from "../login/page.module.css";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  // const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <section className={style.loginSection}>
      <div className={`container ${style.container}`}>
        <div className={`loginContainer ${style.loginContainer}`}>
          <div className="image mb-3">
            <Image
              src="/tryonme.png"
              alt="Login Image"
              width={300}
              height={300}
              className={style.loginImage}
            />
          </div>
          <div className={`content ${style.content}`}>
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-base text-gray-600">
              Please login to your account
            </p>
          </div>
          <form className={style.loginForm} onSubmit={handleLogin}>
            <div className={style.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // disabled={isLoading}
              />
            </div>
            <div className={style.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                minLength={8}
                maxLength={50}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // disabled={isLoading}
              />
            </div>
            <button
              className={style.loginButton}
              type="submit"
              // disabled={isLoading}
            >
              {/* {isLoading ? "Logging in..." : "Login"} */}
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center font-bold">
            Don&apos;t have an account?{" "}
            <Link
              href="/dashboard/register"
              style={{ color: "var(--secondary-color)" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
