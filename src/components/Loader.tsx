import React from 'react';

export default function Loader({loadingtext} : {loadingtext? : string}) {
    if(!loadingtext) loadingtext = 'Loading...';

    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">
        <img src="/softserve_bus.gif" alt="Loading..." className="w-[250px] h-[250px] relative top-[-15px]"/>
        <p className="absolute text-lg text-brown-800 font-light animate-pulse z-10 mt-40">{loadingtext}</p>
      </div>
    );
  }
  