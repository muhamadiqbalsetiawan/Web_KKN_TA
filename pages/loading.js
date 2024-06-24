import Head from "next/head";
import React from "react";

export default function Loading() {
  return (
    <>
      <Head>
        <title>Loading...</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-iconHoverColor">
              <svg
                className="w-full h-full text-primaryColor"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="164.9355 164.9355"
                  strokeDashoffset="62.83185185185186"
                  transform="rotate(294.71 50 50)"
                ></circle>
              </svg>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    </>
  );
}
