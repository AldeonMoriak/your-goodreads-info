'use server';

import { Database } from '@/lib/database.types';
import { Author, Book, Shelf, UserBook } from '@/lib/general.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const HEADER_KEY = {
  'Book Id': 'book_id',
  Title: 'book_title',
  Author: 'author_name',
  'Author l-f': 'author_last_first',
  'Additional Authors': 'additional_authors',
  ISBN: 'isbn',
  ISBN13: 'isbn13',
  'My Rating': 'my_rating',
  'Average Rating': 'average_rating',
  Publisher: 'publisher',
  Binding: 'binding',
  'Number of Pages': 'page_number',
  'Year Published': 'publication_year',
  'Original Publication Year': 'original_publication_year',
  'Date Read': 'date_read',
  'Date Added': 'date_added',
  Bookshelves: 'bookshelves',
  'Bookshelves with positions': 'bookshelves_with_positions',
  'Exclusive Shelf': 'exclusive_shelf',
  'My Review': 'my_review',
  Spoiler: 'spoiler',
  'Private Notes': 'private_notes',
  'Read Count': 'read_count',
} as const;

const COLUMNS = Object.keys(HEADER_KEY) as (keyof typeof HEADER_KEY)[];

export async function uploadCsv(formData: FormData) {
  'use server';
  const supabase = createServerComponentClient<Database>({
    cookies,
  });
  const file = formData.get('file') as File;
  const array = await file.arrayBuffer();

  if (file) {
	 console.time('uploading');
    const { data: user } = await supabase.auth.getUser();
    const bucketName = user.user?.email?.split('@')[0] + '_goodreads_books';
    const fileName = file.name.split('.')[0] + Date.now() + '.' + file.name.split('.')[1];
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, array, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'text/csv',
    });

	 console.timeEnd('uploading');
    if (error) {
      return new Response(error.message, { status: 500 });
    }
	 console.time('downloading');
    const { data: downloadedFile, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(data.path);
    if (downloadError) return new Response(downloadError.message, { status: 500 });
    const content = await downloadedFile.text();

	 console.timeEnd('downloading');
    const lines = content.split('\n');

    let authors: Author[] = [];
    let books: { [x: string]: Book[] } = {};
    let userBooks: { [x: string]: UserBook } = {};
    let shelves: { [x: string]: Shelf[] } = {};
    let uniqueShelves: string[] = [];

	 console.time('preparing');
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const values = prepareRecord(getColumnValues(lines[i]));

      const userBook: UserBook = {
        rating: parseInt(values.my_rating),
        review: values.my_review,
        spoiler: values.spoiler,
        date_read: values.date_read ? values.date_read : null,
        date_added: values.date_added ? values.date_added : null,
        read_count: parseInt(values.read_count),
        private_notes: values.private_notes,
      };

      const author: Author = {
        name: values.author_name,
        name_last_first: values.author_last_first,
      };

      const book: Book = {
        title: values.book_title,
        publisher: values.publisher,
        page_number: parseInt(values.page_number),
        average_rating: parseFloat(values.average_rating),
        publication_year: parseInt(values.publication_year),
        original_publication_year: parseInt(values.original_publication_year),
      };
      const shlvs: Shelf[] = [];
      if (values.exclusive_shelf) {
        shlvs.push({
          title: values.exclusive_shelf,
        });
      }
      if (values.bookshelves) {
        shlvs.push(
          ...values.bookshelves
            .split(',')
            .filter((sh) => sh !== values.exclusive_shelf)
            .map((sh) => ({ title: sh.trim() }))
        );
      }

      shelves[book.title] = shlvs;
      userBooks[book.title] = userBook;

      for (let k = 0; k < shlvs.length; k++) {
        if (!uniqueShelves.includes(shlvs[k].title!)) {
          uniqueShelves.push(shlvs[k].title!);
        }
      }
      const index = authors.findIndex((ath) => ath.name === author.name);
      if (index === -1) {
        authors.push(author);
      }
      if (!books[author.name]) {
        books[author.name] = [];
      }

      books[author.name].push(book);
    }

	 console.timeEnd('preparing')

	 console.time('saving');
    const { data: savedAuthors, error: authorError } = await supabase
      .from('authors')
      .insert(authors)
      .select();

    if (authorError) {
      console.log(authorError);
      return new Response(authorError.message, { status: 500 });
    }
	 console.log('authors saved');

    let toBeSavedBooks: Book[] = [];

    for (let i = 0; i < savedAuthors.length; i++) {
      toBeSavedBooks = books[savedAuthors[i].name!]
        .map((book) => {
          book.author = savedAuthors[i].id;
          return book;
        })
        .concat(toBeSavedBooks);
    }

    const { data: savedBooks, error: booksError } = await supabase
      .from('books')
      .insert(toBeSavedBooks)
      .select();

    if (booksError) {
      console.log(booksError);
      return new Response(booksError.message, { status: 500 });
    }

	 console.log('books saved');

    const { data: savedShelves, error: shelvesError } = await supabase
      .from('bookshelves')
      .insert(uniqueShelves.map((sh) => ({ title: sh })))
      .select();

    if (shelvesError) {
      console.log(shelvesError);
      return new Response(shelvesError.message, { status: 500 });
    }
	 console.log('bookshelves saved');

    let toBeSavedShelvesBooks: Shelf[] = [];

    for (let i = 0; i < savedBooks.length; i++) {
      toBeSavedShelvesBooks = shelves[savedBooks[i].title!]
        .map((shelf) => {
          shelf.bookshelf = savedShelves.find((sh) => sh.title === shelf.title)!.id;
          shelf.book = savedBooks[i].id;
			 const {title, ...rest} = shelf
          return rest;
        })
        .concat(toBeSavedShelvesBooks);
    }

    const {error: book_shelf_error} = await supabase.from('book_shelf').insert(toBeSavedShelvesBooks);
	 console.log(book_shelf_error);

    let toBeSavedUserBooks: UserBook[] = [];

    for (let i = 0; i < savedBooks.length; i++) {
      userBooks[savedBooks[i].title!].book = savedBooks[i].id;
      toBeSavedUserBooks.push(userBooks[savedBooks[i].title!]);
    }

    const {error: uesrBookError} = await supabase.from('user_book').insert(toBeSavedUserBooks);

	 console.log(uesrBookError);

	 console.timeEnd('saving');
	 console.log('done');
    return redirect('/');
  }

  return redirect('/dashboard');
}

type RecordType = (typeof HEADER_KEY)[keyof typeof HEADER_KEY];

function prepareRecord(values: string[]) {
  let record = {} as Record<RecordType, string>;
  for (let i = 0; i < values.length; i++) {
    record[HEADER_KEY[COLUMNS[i]]] = values[i].replace(/"/g, '');
  }
  return record;
}

function getColumnValues(line: string, delimeter = ',') {
  let values: string[] = [];
  let isInQuotation = false;
  let word = '';
  for (let i = 0; i < line.length; i++) {
    if (line[i] === delimeter && !isInQuotation) {
      values.push(word.trim());
      word = '';
      continue;
    }
    word += line[i];
    if (line[i] === '"') {
      isInQuotation = !isInQuotation;
    }
  }
  return values;
}
