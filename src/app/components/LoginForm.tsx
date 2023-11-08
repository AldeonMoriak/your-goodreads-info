'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Session } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export default function LoginForm({ session }: { session: Session | null }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) setErrorMessage(error.message);
    if (!error) router.push('/');
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return session ? (
    <div className="flex h-screen justify-center items-center">
      <button className="bg-blue-500 rounded py-2 px-4" onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  ) : (
    <div className="flex h-screen justify-center items-center">
      <form
        className="w-full max-w-md shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={isSignIn ? handleSignIn : handleSignUp}
      >
      <p className='text-red-400 text-sm'>{errorMessage}</p>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            required
            name="email"
            onChange={handleInputChange}
            value={form.email}
            type="email"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            onChange={handleInputChange}
            required
            value={form.password}
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isSignIn ? 'Sign In' : 'Sign up'}
          </button>
        </div>
        <button
          className="mt-5 text-gray-400 text-sm underline hover:text-gray-800"
          type="button"
          onClick={() => setIsSignIn((prev) => !prev)}
        >
          {' '}
          Wanna {isSignIn ? 'Sign Up' : 'Sign In'}?
        </button>
      </form>
    </div>
  );
}
