import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import BookCard from '../components/BookCard';

export default async function Books() {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/login');
	}

	const { data } = await supabase
		.from('books')
		.select(`*, authors(name), user_book(date_added, rating)`)
		.order('date_added', { foreignTable: 'user_book', ascending: false });

	return (
		<div className="p-5">
			<div className="text-4xl font-bold mb-4 text-center">Books</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 leading-6 rounded-lg">
				{data?.map((book) => (
					<Link key={book.id} href={'/books/' + book.id} className='w-full'>
						<BookCard book={book} />
					</Link>
				))}
			</div>
		</div>
	);
}
