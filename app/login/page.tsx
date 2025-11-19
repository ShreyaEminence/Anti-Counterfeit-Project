"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "@/_lib/api";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { setCustomCookie } from "@/_lib/utils/helper";
export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);
  // STATIC FCM TOKEN
  const STATIC_FCM_TOKEN = "dGVzdF9mY21fdG9rZW5fZXhhbXBsZQ";

  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        fcmToken: STATIC_FCM_TOKEN,
      };

      const { data } = await api.post("/business-owner/login", payload);

      // Save token
      localStorage.setItem("token", data?.token);
      setCustomCookie("token", data?.token);

      // Save user
      if (data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      // Save business owner data
      if (data?.data?.businessOwner) {
        localStorage.setItem(
          "businessOwner",
          JSON.stringify(data.data.businessOwner)
        );
      }

      // Redirect
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Login failed. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Coming Soon");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-12 flex-col justify-between relative overflow-y-auto">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg
                  className="w-6 h-6 text-purple-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="3" y="3" width="8" height="8" rx="1" />
                  <rect x="5" y="5" width="4" height="4" fill="white" />
                  <rect x="13" y="3" width="8" height="8" rx="1" />
                  <rect x="15" y="5" width="4" height="4" fill="white" />
                  <rect x="3" y="13" width="8" height="8" rx="1" />
                  <rect x="5" y="15" width="4" height="4" fill="white" />
                  <rect x="15" y="13" width="3" height="2" />
                  <rect x="15" y="17" width="3" height="2" />
                  <rect x="19" y="13" width="2" height="6" />
                  <rect x="13" y="13" width="2" height="6" />
                </svg>
              </div>
              <span className="text-white text-2xl font-semibold">
                verici.io
              </span>
            </div>

            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Protect Your Brand with{" "}
              <span className="font-extrabold">AI-Powered Authentication</span>
            </h1>

            <p className="text-white text-lg mb-10 opacity-95 max-w-lg">
              Advanced blockchain meets AI to eliminate counterfeiting.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 bg-white relative flex items-center justify-center p-8 overflow-y-auto">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          ></div>

          <div className="w-full max-w-md relative z-10">
            <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
              <h2 className="text-4xl font-bold text-purple-600 mb-10">
                Sign In
              </h2>

              <form className="space-y-6" onSubmit={handleLogin}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full px-4 py-3.5 border rounded-lg"
                  onChange={handleInput}
                  required
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full px-4 py-3.5 border rounded-lg pr-12"
                    onChange={handleInput}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={22} />
                    ) : (
                      <AiOutlineEye size={22} />
                    )}
                  </button>
                </div>

                <div className="flex justify-end -mt-2">
                  <Link
                    href="#"
                    className="text-sm text-purple-500 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-lg"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border rounded-lg bg-white"
              >
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white text-center py-4 text-sm w-full flex-shrink-0">
        © 2025, Verici.io. All Rights Reserved
      </div>
    </div>
  );
}
