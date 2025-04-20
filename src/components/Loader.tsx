import React from 'react';

export default function Loader({loadingtext} : {loadingtext? : string}) {
    if(!loadingtext) loadingtext = 'Loading...';

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 text-brown-700">
        <img src="/icecream_melting.gif" alt="Loading..." className="w-24 h-24 mb-4" />
        <p className="text-lg font-light animate-pulse">{loadingtext}</p>
      </div>
    );
  }
  