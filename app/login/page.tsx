'use client'

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="flex flex-col space-y-2">
          <button onClick={() => signIn('github')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Sign In with GitHub
          </button>
          <button onClick={() => signIn('google')} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Sign In with Google
          </button>
        </div>
      </div>
    </div>
  );
}
