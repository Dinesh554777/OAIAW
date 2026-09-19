import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-5xl font-extrabold mb-8 text-black">OAIAW</h1>
      <p className="text-xl mb-12 text-gray-600">Online Assessment in the AI World</p>
      
      <div className="flex gap-4">
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          Login
        </Link>
        <Link href="/register" className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700">
          Register
        </Link>
      </div>
    </main>
  );
}
