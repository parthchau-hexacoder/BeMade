import { useState } from "react";
import type { FormEvent } from "react";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="flex flex-1 min-h-0 items-center justify-center  px-4 py-8 sm:px-6 md:py-12">
      <section className="w-full max-w-[520px] rounded-2xl border border-[#d6d6d6]  p-5 shadow-[0_6px_18px_rgba(0,0,0,0.06)] sm:p-8">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
              return;
            }
            navigate("/");
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-black transition hover:opacity-70 sm:text-base"
        >
          <FiArrowLeft size={16} />
          Back
        </button>

        <h1 className="mt-4 text-center text-3xl font-semibold text-black sm:text-4xl">
          Login
        </h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
          <label className="block">
            <span className="text-base text-gray-700 sm:text-lg">
              <span className="text-red-500">*</span> Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-[#c8c8c8] bg-[#f2f2f2] px-3 text-base text-black outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400 sm:h-12 sm:px-4 sm:text-lg"
            />
          </label>

          <label className="block">
            <span className="text-base text-gray-700 sm:text-lg">
              <span className="text-red-500">*</span> Password
            </span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#c8c8c8] bg-[#f2f2f2] px-3 pr-11 text-base text-black outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-400 sm:h-12 sm:px-4 sm:pr-12 sm:text-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-black py-3 text-base font-medium text-white transition hover:bg-[#151515] sm:py-3.5 sm:text-lg"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black sm:text-base">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-semibold underline underline-offset-2">
            Sign Up
          </a>
        </p>
      </section>
    </main>
  );
};
