import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
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
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
        <Link href="/books">
          <div className="border border-white rounded p-2 bg-purple-500">
            <div>Books Count: {bookCount}</div>
          </div>
        </Link>

        <Link href="/authors">
          <div className="border border-white rounded p-2 bg-purple-500">
            <div>Authors Count: {authorCount}</div>
          </div>
        </Link>
        <Link href="/bookshelves">
          <div className="border border-white rounded p-2 bg-purple-500">
            <div>Book Shelves Count: {bookShelveCount}</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
