import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';
import BookCard from '@/app/components/BookCard';
import Link from 'next/link';

export default async function Author({ params }: { params: { id: string } }) {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/login');
	}

	const { data: author, error } = await supabase
		.from('authors')
		.select(`*, books(*)`)
		.eq('id', params.id)
		.single();

	return (
		<div className="p-5">
			{author ? (
				<>
					<section className=" p-4">
						<div className="text-2xl font-bold mb-2">{author.name}</div>
						<div className="text-lg">{author.books.length} books</div>
					</section>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
						{author.books.map((book) => (
							<Link key={book.id} href={'/books/' + book.id}>
								<BookCard book={book} />
							</Link>
						))}
					</div>
				</>
			) : (
				<p> Author was not found</p>
			)}
		</div>
	);
}
