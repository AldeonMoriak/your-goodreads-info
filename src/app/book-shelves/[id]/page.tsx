import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import BookCard from '@/app/components/BookCard';

export default async function Bookshelf({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: bookshelf, error } = await supabase
    .from('bookshelves')
    .select(`*, book_shelf(count)`)
    .eq('id', params.id)
    .single();

  if (error) return redirect('/book-shelves');
  const { data: books, error: bookError } = await supabase
    .from('books')
    .select(`*, book_shelf!inner(bookshelf)`)
    .eq('book_shelf.bookshelf', params.id);

  return (
    <div className="p-5">
      {bookshelf ? (
        <>
          <section className=" p-4">
            <div className="text-2xl font-bold mb-2">Shelf: {bookshelf.title}</div>
            {books ? <div className="text-lg">{books.length} books</div> : null}
          </section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
            {books?.map((book) => (
              <Link href={'/books/' + book.id} key={book.id} className='w-full'>
                <BookCard book={book} />
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
