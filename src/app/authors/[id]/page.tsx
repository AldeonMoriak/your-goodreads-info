import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';

export default async function Author({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const { data: author } = await supabase
    .from('authors')
    .select(`*, books(*)`)
    .eq('id', params.id)
    .single();

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-6 bg-stripes-fuchsia rounded-lg">
        {author ? (
          <>
            <div className="border border-white rounded p-2 bg-purple-500">
              <div>{author.name}</div>
            </div>
            {author.books.map((book) => (
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
