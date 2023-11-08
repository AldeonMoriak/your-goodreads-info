import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Authors() {
	const supabase = createServerComponentClient<Database>({
		cookies,
	});

	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session) {
		redirect('/login');
	}

	const { data, error } = await supabase
		.from('authors')
		.select(`*, books(count)`)
		.order('books_count', { ascending: false });
	console.log(data, error);

	return (
		<div className="p-5">
			<div className="text-4xl font-bold mb-4 text-center">Authors</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 leading-6 rounded-lg ">
				{data?.map((author) => (
					<Link href={'/authors/' + author.id} key={author.id} className='mx-auto w-full'>
						<div className="bg-white rounded-lg shadow-md p-4 border-2 border-white hover:border-green-200">
							<div className="bg-green-200 h-32 w-full rounded-md mb-2"></div>
							<h2 className="text-xl font-semibold">{author.name}</h2>
							<p className="text-lg">{author.name_last_first}</p>
							<p className="text-lg">{(author.books[0] as any).count} books</p>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
