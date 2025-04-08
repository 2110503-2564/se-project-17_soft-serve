'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Banner() {
  const covers = [
    '/img/somtum.jpg',
    '/img/sushi.jpg',
    '/img/pizza.jpg',
    '/img/tuaytung.jpg',
  ];
  const [index, setIndex] = useState(0);
  const router = useRouter();

  return (
    <div
      className="block p-1 m-0 w-screen h-[80vh] relative"
      onClick={() => setIndex(index + 1)}
    >
      <Image
        src={covers[index % 4]}
        alt="cover"
        fill={true}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
}
