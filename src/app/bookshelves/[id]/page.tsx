import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';

export default async function Bookshelf({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: bookshelf, error } = await supabase
    .from('bookshelves')
    .select(`*, book_shelf(count)`)
    .eq('id', params.id)
    .single();

  if (error) return error.message;
  const { data: books, error: bookError } = await supabase
    .from('books')
    .select(`*, book_shelf(count)`)
    .eq('book_shelf.bookshelf', params.id);

  console.log(bookError);

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
        {bookshelf ? (
          <>
            <div className="border border-white rounded p-2 bg-purple-500">
              <div>{bookshelf.title}</div>
              <div>{books ? JSON.stringify(books[0], null, 2) : null}</div>
            </div>
            {books?.map((book) => (
              <div key={book.id}>
                <div>{book.title}</div>
                <div>{book.page_number} pages</div>
                <div>{book.average_rating} stars. </div>
                <div>originally published on {book.original_publication_year}</div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
