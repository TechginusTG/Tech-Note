import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Tech-Note</h1>
        <p className="text-xl text-gray-600 mb-12">
          Your new platform for tech blogs and community discussions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Link href="/blog" className="block p-8 border rounded-lg hover:shadow-lg hover:border-blue-500 transition-all">
          <h2 className="text-3xl font-bold mb-2">Read the Blog</h2>
          <p>Explore articles and tutorials on the latest in technology.</p>
        </Link>

        <Link href="/admin/blog/new" className="block p-8 border rounded-lg hover:shadow-lg hover:border-green-500 transition-all">
          <h2 className="text-3xl font-bold mb-2">Write a Post</h2>
          <p>Share your knowledge and write a new blog post.</p>
        </Link>

        <Link href="/community" className="block p-8 border rounded-lg hover:shadow-lg hover:border-purple-500 transition-all md:col-span-2">
          <h2 className="text-3xl font-bold mb-2">Join the Community</h2>
          <p>Engage in discussions and connect with other developers.</p>
        </Link>
      </div>
    </main>
  );
}
