import React from 'react';

export default function Loader({loadingtext} : {loadingtext? : string}) {
    if(!loadingtext) loadingtext = 'Loading...';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-brown-700">
        <img src="/icecream_melting.gif" alt="Loading..." className="w-[100px] h-[100px] mb-4" />
        <p className="text-lg font-light animate-pulse">{loadingtext}</p>
      </div>
    );
  }
  