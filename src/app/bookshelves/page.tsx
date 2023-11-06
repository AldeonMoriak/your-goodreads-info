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
    redirect('/');
  }

  const { data, error } = await supabase
    .from('bookshelves')
    .select(`*, book_shelf(count)`)
    .order('books_count_for_shelves', { ascending: false });

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
        {data?.map((bookshelf) => (
          <Link href={'/bookshelves/' + bookshelf.id} key={bookshelf.id}>
            <div className="border border-white rounded p-2 bg-purple-500">
              <div>{bookshelf.title}</div>
              <div>{(bookshelf.book_shelf[0] as any).count} books</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
