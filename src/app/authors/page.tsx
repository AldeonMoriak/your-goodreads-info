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
    redirect('/');
  }

  const { data, error } = await supabase
    .from('authors')
    .select(`*, books(count)`)
    .order('books_count', { ascending: false });
  console.log(data, error);

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
        {data?.map((author) => (
          <Link href={'/authors/' + author.id} key={author.id}>
            <div className="border border-white rounded p-2 bg-purple-500">
              <div>{author.name}</div>
              <div>{author.name_last_first}</div>
              <div>{(author.books[0] as any).count} books</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
