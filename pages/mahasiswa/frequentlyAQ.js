import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Link from "next/link";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Head from "next/head";
import useSWR from "swr";
import Loading from "../loading";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function FrequentlyAQ() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: questionsFaq = [], error } = useSWR(
    "/api/admin/mahasiswa/faqQuery",
    fetcher
  );

  let displayFaq = "";
  const role = Session?.user?.role;

  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return <div>Error loading group details</div>;
  }

  if (!questionsFaq) {
    return <div>Loading... Data Error</div>;
  }

  // Calculate pagination
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = questionsFaq.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "mahasiswa") {
    displayFaq = (
      <>
        <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
        <div className="flex flex-row justify-start">
          <div className="md:w-auto h-screen">
            <SidebarMahasiswa />
          </div>
          <div className="overflow-auto h-screen w-screen grow">
            <Navbar />
            <div className="px-6 pb-5 w-auto">
              <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                <h1>Frequently Asked Questions (FAQ)</h1>
              </div>
              <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl">
                <ul role="list" className="divide-y divide-white">
                  {currentItems.map((question, index) => (
                    <li key={index} className="flex justify-between py-2">
                      <div>
                        <div className="flex min-w-0 gap-x-4">
                          <div className="min-w-0 flex-auto">
                            <p className="text-lg font-semibold text-gray-900">
                              {question.pertanyaan}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-lg text-gray-900">
                            {question.jawaban}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* Pagination */}
                <ul className="flex justify-center mt-4">
                  {Array.from({
                    length: Math.ceil(questionsFaq.length / itemsPerPage),
                  }).map((_, index) => (
                    <li key={index} className="mx-2">
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === index + 1
                            ? "bg-iconHoverColor text-white font-bold"
                            : "bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (status === "authenticated" && role === "dosen") {
    displayFaq = "";
    router.push("/dosen/dashboard");
  } else {
    displayFaq = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>FAQ</title>
        <meta property="og:title" content="FAQ" key="title" />
      </Head>
      {displayFaq}
    </>
  );
}
