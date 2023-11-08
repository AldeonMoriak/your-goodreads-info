'use client';

import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar({ session }: { session: Session | null }) {
	const pathname = usePathname();
	return (
		<nav className="p-4">
			<ul className="flex justify-center space-x-4 text-sm md:text-base">
				<li>
					<Link
						href="/"
						className={`${pathname === '/' ? 'underline' : ''
							} hover:underline decoration-orange-300 decoration-2`}
					>
						Home
					</Link>
				</li>
				{session ? (
					<>
						<li>
							<Link
								href="/overview"
								className={`${pathname === '/overview' ? 'underline' : ''
									} hover:underline decoration-orange-300 decoration-2`}
							>
								Overview
							</Link>
						</li>
						<li>
							<Link
								href="/books"
								className={`${pathname?.includes('/books') ? 'underline' : ''
									} hover:underline decoration-orange-300 decoration-2`}
							>
								Books
							</Link>
						</li>
						<li>
							<Link
								href="/authors"
								className={`${pathname?.includes('/authors') ? 'underline' : ''
									} hover:underline decoration-orange-300 decoration-2`}
							>
								Authors
							</Link>
						</li>
						<li>
							<Link
								href="/book-shelves"
								className={`${pathname?.includes('/book-shelves') ? 'underline' : ''
									} hover:underline decoration-orange-300 decoration-2 line-clamp-1`}
							>
								Book Shelves
							</Link>
						</li>
					</>
				) : (
					<li>
						<Link
							href="/login"
							className={`${pathname === '/login' ? 'underline' : ''
								} hover:underline decoration-orange-300 decoration-2`}
						>
							Log In
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
