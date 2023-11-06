import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';

export default async function Book({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: book } = await supabase
    .from('books')
    .select(`*, authors(name), user_book(*)`)
    .eq('id', params.id)
    .single();

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
        {book ? (
          <div className="border border-white rounded p-2 bg-purple-500">
            <div>{book.title}</div>
            <div>{book.authors?.name}</div>
            <div>{book.page_number} pages</div>
            <div>
              {book.average_rating} stars.{' '}
              {book.user_book[0]?.rating ? (
                <span> your rating: {book.user_book[0]?.rating} stars</span>
              ) : null}
            </div>
            <div>originally published on {book.original_publication_year}</div>
            <div>added on {book.user_book[0]?.date_added}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
