import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';
import RateStar from '@/app/components/RateStar';
import Link from 'next/link';

export default async function Book({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: book, error } = await supabase
    .from('books')
    .select(`*, authors(name), user_book(*), bookshelves(title, id)`)
    .eq('id', params.id)
    .single();

  return (
    <div className="p-5">
      {book ? (
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="p-6 w-sm col-span-12 md:col-span-3 relative">
              <div className="sticky top-2">
                <div className="bg-blue-200 mx-auto h-64 w-64 md:w-auto rounded-md mb-2"></div>
                {book.user_book && book.user_book?.length ? (
                  <>
                    <div className="flex justify-center mb-2">
                      <RateStar size="h-8 w-8" rating={book.user_book[0].rating ?? 0} />
                    </div>
                    {book.user_book[0].date_read ? (
                      <>
                        <p className="text-sm text-center mb-2">
                          Read on{' '}
                          {new Date(book.user_book[0].date_read).toLocaleDateString('en-US', {
                            dateStyle: 'long',
                          })}
                        </p>
                        <p className="text-sm text-center mb-2">
                          Read {book.user_book[0].read_count}{' '}
                          {(book.user_book[0].read_count ?? 0) > 1 ? 'times' : 'time'}
                        </p>
                      </>
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            <div className="bg-white rounded-lg leading-10 p-6 col-span-12 md:col-span-9">
              <h1 className="text-3xl font-semibold mb-4">{book.title}</h1>
              <Link
                href={'/authors/' + book.author}
                className="text-xl decoration-2 hover:underline hover:decoration-orange-300 mb-2"
              >
                {book.authors?.name}
              </Link>
              <div className="flex items-center">
                <RateStar size="w-8 h-8" rating={book.average_rating ?? 0} />
                <span className="ml-2 text-2xl">{book.average_rating}</span>
              </div>
              <span className="text-sm mb-2">{book.page_number} pages</span>
              <span className="text-sm mb-2">, published on {book.original_publication_year}</span>
              <span className="text-sm mb-2">, by {book.publisher}</span>
              <div>
                {book.bookshelves.map((shelf) => (
                  <Link
                    key={shelf.id}
                    className="underline decoration-purple-400 decoration-2 text-sm mr-2 font-semibold underline-offset-4"
                    href={'/book-shelves/' + shelf.id}
                  >
                    {shelf.title}
                  </Link>
                ))}
              </div>
              <p className="text-base max-w-2xl indent-8 whitespace-normal mt-10 break-words">
                {book.user_book[0].review}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
