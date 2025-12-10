import { formR, serverUrl } from "@/lib/api";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [form, setForm] = useState<formR>({
    name: {
      title: "Full name",
      type: "text",
      value: "",
      placeholder: "Enter your name",
    },
    email: {
      title: "Email",
      type: "email",
      value: "",
      placeholder: "Enter your email",
    },
    password: {
      title: "Password",
      type: "password",
      value: "",
      placeholder: "Enter a password",
    },
    dob: {
      title: "Date of Birth",
      type: "date",
      value: "",
      placeholder: "",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: { ...form[name], value },
    }));
  };

  const createAccount = async (e) => {
    e.preventDefault();

    // reset all
    setError("");
    setLoading(false);
    if (
      !form?.name?.value ||
      !form?.email?.value ||
      !form?.password?.value ||
      !form?.dob?.value ||
      loading
    )
      return;

    setLoading(true);

    type User = {
      name: string;
      email: string;
      password: string;
      dob: string;
    };

    const user: User = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      dob: form.dob.value,
    };

    try {
      const res = await axios.post(`${serverUrl}/signup`, user, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data?.success) navigate("/dashboard");
    } catch (err) {
      const { response } = err;
      if (response) {
        const { data } = response;
        if(data.errors){
          const errKeys = Object.keys(data.errors);
          return setError(data?.errors[errKeys[1]]["_errors"][0] || data.message)
        }
        setError(data.message)
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen px-4 from-background relative">
      {/* Signup Card */}
      <div className="p-8 pt-0 rounded-2xl shadow-md w-full max-w-md mt-10 from-background">
        <h2 className="text-3xl font-bold text-center  mb-6">
          Create a New Account
        </h2>
        {error && (
          <div className="error text-center text-red-600 text-sm mb-2">
            {error}
          </div>
        )}

        <form onSubmit={createAccount} className="space-y-4">
          {["name", "email", "password", "dob"].map((item, index) => {
            return (
              <div key={index}>
                <label htmlFor="name" className="block text-sm font-medium">
                  {form[item]?.title}
                </label>
                <input
                  id={item}
                  name={item}
                  type={form[item]?.type}
                  required
                  value={form[item]?.value}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border bg-primary-foreground rounded-lg outline-none shadow-sm focus:ring-2 focus:ring-secondary focus:border-secondary"
                  placeholder={form[item]?.placeholder}
                />
              </div>
            );
          })}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg hover-lift rounded-lg"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
