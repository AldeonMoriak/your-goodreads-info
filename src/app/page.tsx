import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Welcome to Your Goodreads Info App</h1>
          <p className="text-gray-600 mb-6">
            Explore our{' '}
            <span className="underline underline-offset-2 decoration-orange-500 text-gray-400 text-lg">
              features
            </span>{' '}
            and{' '}
            <span className="underline underline-offset-2 decoration-orange-500 text-gray-400 text-lg">
              examples
            </span>{' '}
            below:
          </p>
          {!session ? (
            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Log In
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Dashboard
            </Link>
			 )}
          <p className="mt-4">
            {`Here's`} an{' '}
            <Link href="/example" className="text-orange-300 text-lg underline decoration-white">
              example
            </Link>{' '}
            page.
          </p>
        </div>
      </div>
    </main>
  );
}
