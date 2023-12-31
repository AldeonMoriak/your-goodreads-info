import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import NavBar from './components/NavBar';

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
			<body className={`${inter.className} max-w-7xl mx-auto px-2 bg-white text-gray-800`}>
				<NavBar session={session} />
				{children}
			</body>
		</html>
	);
}
