"use client";

import { FaGithub, FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Login</h1>
        <div className="space-y-4">
          <a
            href={`${backendUrl}/oauth2/authorization/google`}
            className="flex items-center justify-center w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </a>
          <a
            href={`${backendUrl}/oauth2/authorization/github`}
            className="flex items-center justify-center w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaGithub className="mr-2" />
            Sign in with GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

