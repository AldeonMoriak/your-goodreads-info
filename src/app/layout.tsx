import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Your Goodreads Info',
  description:
    'A web app to aim you in your reading journey by showing you some of of your reading history.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <nav className="p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                Home
              </Link>
            </li>
            <li>
              {session ? (
                <Link href="/dashboard">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login">
                  Log In
                </Link>
              )}
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
