import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Overview() {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/login');
	}

	const { count: bookCount } = await supabase
		.from('books')
		.select('*', { count: 'exact', head: true });
	const { count: authorCount } = await supabase
		.from('authors')
		.select('*', { count: 'exact', head: true });
	const { count: bookShelveCount } = await supabase
		.from('bookshelves')
		.select('*', { count: 'exact', head: true });

	return (
		<section className="text-center py-8">
			<div className="text-4xl font-bold mb-4">Library Overview</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<Link href="/books">
					<div className="bg-blue-200 p-4 rounded-lg">
						<h3 className="text-2xl font-semibold">Books</h3>
						<p className="text-xl">Total: {bookCount}</p>
					</div>
				</Link>
				<Link href="/authors">
					<div className="bg-green-200 p-4 rounded-lg">
						<h3 className="text-2xl font-semibold">Authors</h3>
						<p className="text-xl">Total: {authorCount}</p>
					</div>
				</Link>
				<Link href="/book-shelves">
					<div className="bg-yellow-200 p-4 rounded-lg">
						<h3 className="text-2xl font-semibold">Book Shelves</h3>
						<p className="text-xl">Total: {bookShelveCount}</p>
					</div>
				</Link>
			</div>
		</section>
	);
}
