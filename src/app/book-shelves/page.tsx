import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BookShelves() {
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
    .from('bookshelves')
    .select(`*, book_shelf(count)`)
    .order('books_count_for_shelves', { ascending: false });

  return (
    <div className="p-5">
      <div className="text-4xl font-bold mb-4 text-center">Book Shelves</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 leading-6 rounded-lg">
        {data?.map((bookshelf) => (
          <Link href={'/book-shelves/' + bookshelf.id} key={bookshelf.id} className="w-full">
            <div className="mx-auto max-w-sm bg-white rounded-lg shadow-md p-4 m-2 border-2 border-white hover:border-yellow-200">
              <div className="bg-yellow-200 h-32 w-full rounded-md mb-2"></div>
              <h2 className="text-xl font-semibold">{bookshelf.title}</h2>
              <p className="text-lg">{(bookshelf.book_shelf[0] as any).count} books</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
