import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to BlogApp
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          A simple, elegant blog application where you can share your stories with the world.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/blog"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition"
          >
            Read Blog Posts
          </Link>
          <Link
            href="/signup"
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📝 Create Posts
            </h3>
            <p className="text-gray-600">
              Write and publish your thoughts with a simple editor.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔐 Secure Account
            </h3>
            <p className="text-gray-600">
              Create an account and manage your posts safely.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🌍 Share Stories
            </h3>
            <p className="text-gray-600">
              Publish your posts and share them with others.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
