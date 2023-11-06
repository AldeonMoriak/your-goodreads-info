import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { uploadCsv } from '../actions';
import { Database } from '@/lib/database.types';
import { redirect } from 'next/navigation';

export default async function Prepare() {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }
  const { data: userData } = await supabase.auth.getUser();

  const bucketName = userData.user?.email?.split('@')[0] + '_goodreads_books';
  let uploadedFiles;
  const { data: bucket, error } = await supabase.storage.getBucket(bucketName);
  if (error) {
    await supabase.storage.createBucket(bucketName, {
      public: false,
      allowedMimeTypes: ['text/csv'],
      fileSizeLimit: '2MB',
    });
  } else {
    const { data: files } = await supabase.storage.from(bucket.name).list();
    uploadedFiles = files;
  }

  return (
    <>
      <form className="mx-auto w-24 border border-blue-500" action={uploadCsv}>
        <input
          type="file"
          name="file"
          accept=".csv"
          className="border border-blue-500 p-2 m-2 rounded"
        />
        <button type="submit" className="border border-blue-500 p-2 m-2 rounded bg-blue-800">
          Upload
        </button>
      </form>
      {/*<Files serverFiles={data ?? []} />*/}
      <div className="flex flex-col max-w-md">
        {uploadedFiles?.map((file) => (
          <button
            type="button"
            key={file.id}
            className="border border-blue-500 p-2 m-2 rounded bg-blue-800"
          >
            {file.name}
          </button>
        ))}
      </div>
    </>
  );
}
