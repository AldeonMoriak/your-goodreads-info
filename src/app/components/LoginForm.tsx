'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Session } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export default function LoginForm({ session }: { session: Session | null }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

	 console.log(error, data);
	 if(!error) router.push('/')
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
      <form className="w-full max-w-md shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            required
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            id="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSignUp}
          >
            Sign up
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSignIn}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
