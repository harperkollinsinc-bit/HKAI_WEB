import { useAuthContext } from "@/context/authContext";
import { serverUrl } from "@/lib/api";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
  const { setUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password || loading) return;
    try {
      const res = await axios.post(
        `${serverUrl}/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.success) {
        navigate("/dashboard");
        setUser(res.data.data);
      }
    } catch (error) {
      const { response } = error;
      console.log(error);
      if (response) setError(response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen from-background to-muted/20 px-4">
      <div className="shadow-lg p-8 rounded-xl w-full max-w-md from-background">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center  mb-6 px-4">
          Welcome Back 👋
        </h2>

        {/* Form */}
        <form onSubmit={login} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border  bg-primary-foreground rounded-lg shadow-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border bg-primary-foreground rounded-lg shadow-sm outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
              placeholder="Enter your password"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 text-center font-medium">
              {error}
            </p>
          )}

          {/* Options */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="text-secondary border-gray-300 rounded"
              />
              Remember me
            </label>
            <Link
              to="/forgotpass"
              className="text-secondary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg hover-lift rounded-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
          {/* <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8 py-6 hover-lift"
          >
            Get Started Free
          </Button> */}
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Sign in */}
        {/* <GoogleSignIn setUser={setUser} /> */}

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-secondary font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
