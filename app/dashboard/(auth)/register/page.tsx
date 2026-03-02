"use client";

import { useState, useTransition } from "react";
import style from "./page.module.css";
import Link from "next/link";
// import PhoneInput from "react-phone-number-input";
import PhoneInput from "react-phone-input-2";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../../../lib/lib/supabase";

export default function Register() {
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
                country={"eg"}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputClass={style.phoneInput}
                buttonClass={style.flagButton}
                containerClass={style.phoneContainer}
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
              <div className="show">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 8 characters)"
                required
                minLength={8}
                maxLength={50}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // disabled={isLoading}
                />
                <span
                  className={style.showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    }
                </span>
              </div>
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
