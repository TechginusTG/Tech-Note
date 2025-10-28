"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  const router = useRouter();

  const handleTestLogin = async () => {
    try {
      console.log("Attempting test login...");
      const result = await signIn("credentials", {
        email: "test@example.com",
        redirect: false,
      });

      console.log("signIn result:", result);

      if (result?.ok) {
        console.log("Login successful, redirecting to home...");
        router.push("/");
      } else {
        console.error("Login failed", result);
        alert("Test login failed: " + result?.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred during signIn:", error);
      alert("An unexpected error occurred. Check the console.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Login</h1>
        <div className="space-y-4">
          {isDevelopment && (
            <button
              onClick={handleTestLogin}
              className="flex items-center justify-center w-64 px-4 py-2 border border-dashed border-blue-400 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
            >
              Login as Test User
            </button>
          )}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex items-center justify-center w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaGithub className="mr-2" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
