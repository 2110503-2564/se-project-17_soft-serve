'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopMenuItem({ title, pageRef }: { title: string; pageRef: string }) {
    const pathname = usePathname();
    const isActive = pageRef === '/' ? pathname === pageRef : pathname.startsWith(pageRef);

    return (
        <Link href={pageRef}
            className={`text-center text-[#d42d2d] text-[19px] font-semibold mx-5 my-auto hover:underline hover:text-myred
            ${ isActive ? 'underline text-myred' : ''}`}>
            {title}
        </Link>
    );
}