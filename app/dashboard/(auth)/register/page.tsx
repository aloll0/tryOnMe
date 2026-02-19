"use client";

import { useState, useTransition } from "react";
import style from "./page.module.css";
import Link from "next/link";
import PhoneInput from "react-phone-number-input";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../../lib/lib/supabase";

export default function Register() {
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


// const [isLoading, setIsLoading] = useState(false);

const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    startTransition(async () => {
    const { error } = await getSupabaseClient().auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          gender,
        },
      },
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully ✅");
    router.push("/dashboard/login");
    });
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  return (
    <section className={style.registerSection}>
      <div className={`container ${style.container}`}>
        <div className={`loginContainer ${style.registerContainer}`}>
          <div className={style.content}>
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
          </div>

          <form className={style.registerForm} onSubmit={handleRegister}>
            <div className={style.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                // disabled={isLoading}
              />
            </div>

            <div className={style.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="example@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // disabled={isLoading}
              />
            </div>

            <div className={style.inputGroup}>
              <label>Mobile Number</label>

              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={(value) => setPhone(value || "")}
                defaultCountry="EG"
                international
                required
                className={style.phoneInput}
                // disabled={isLoading}
              />
            </div>

            <div className={style.selectGroup}>
              <label className={style.genderLabel}>Gender *</label>

              <div className={style.genderButtons}>
                <button
                  type="button"
                  className={`${style.genderBtn} ${
                    gender === "male" ? style.active : ""
                  }`}
                  onClick={() => setGender("male")}
                  // disabled={isLoading}
                >
                  Male
                </button>

                <button
                  type="button"
                  className={`${style.genderBtn} ${
                    gender === "female" ? style.active : ""
                  }`}
                  onClick={() => setGender("female")}
                  // disabled={isLoading}
                >
                  Female
                </button>
              </div>
            </div>

            <div className={style.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Password (min 8 characters)"
                required
                minLength={8}
                maxLength={50}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // disabled={isLoading}
              />
            </div>

            <div className={style.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                required
                minLength={8}
                maxLength={50}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // disabled={isLoading}
              />
              {confirmPassword && password !== confirmPassword && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            <button
              className={style.registerButton}
              type="submit"
              // disabled={isLoading}
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center font-bold">
            Already have an account?{" "}
            <Link
              href="/dashboard/login"
              style={{ color: "var(--secondary-color)" }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
