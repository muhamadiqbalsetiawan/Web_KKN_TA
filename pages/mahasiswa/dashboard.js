import React from "react";
import SidebarMahasiswa from "@/components/sidebarMahasiswa";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Head from "next/head";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Loading from "../loading";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  // Fetcher function to use with useSWR
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  // Additional state for API data
  const { data: apiData, error: apiError } = useSWR(
    `/api/mahasiswa/fetchData`,
    fetcher
  );

  const id = Session?.user?.username;

  const { data: tables = [] } = useSWR(
    `/api/mahasiswa/profilQuery?nim=${id}`,
    fetcher
  );

  const nama = tables[0]?.name;

  const image = Session?.user?.image;
  const role = Session?.user?.role;
  let displayDashboard = "";

  const downloadMenu = [
    {
      item: "Unduh Juknis KKN",
      link: "/",
      color: "bg-[#C70039]",
    },
    {
      item: "Unduh Timeline KKN",
      link: "/",
      color: "bg-[#F39F5A]",
    },
    {
      item: "Unduh Juknis Pelaporan KKN",
      link: "/",
      color: "bg-[#26577C]",
    },
  ];

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "mahasiswa") {
    displayDashboard = (
      <>
        <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
        <div className="flex flex-row justify-start">
          <div className="md:w-auto h-screen">
            <SidebarMahasiswa />
          </div>
          <div className="h-screen w-screen overflow-auto grow">
            <Navbar />
            <div className="px-6 pb-5 w-auto">
              <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                <h1>Dashboard</h1>
              </div>
              <div className="p-3 md:p-6 bg-white rounded-xl shadow-xl">
                {apiData && (
                  <div>
                    <h1 className="text-sm md:text-3xl font-semibold pb-1 md:pb-3">
                      Assalamu&apos;alaikum,{" "}
                      {apiData.nama ? apiData.nama : nama}
                    </h1>
                  </div>
                )}
                <div className="mt-3 flex flex-row flex-wrap justify-around">
                  <div className="lg:w-6/12 border-inputColor border rounded-lg">
                    <picture>
                      <img
                        src="/images/broschure-dummy.png"
                        alt="Timeline KKN Image"
                        className="xl:max-w-screen rounded-lg"
                      />
                    </picture>
                  </div>
                  <div className="lg:w-5/12 text-justify mt-3 lg:mt-0">
                    <h2 className="font-extrabold text-sm md:text-4xl mb-1 md:mb-7">
                      Apa itu KKN?
                    </h2>
                    <p className="text-sm md:text-lg font-medium mb-3">
                      KKN merupakan kepanjangan dari Kuliah Kerja Nyata. Ini
                      merupakan program mahasiswa untuk mengabdi kepada
                      masyarakat dengan pendekatan lintas keilmuan dan sektoral
                      dalam kurun waktu tertentu. Biasanya KKN dilakukan selama
                      1 atau 2 bulan di sebuah desa atau wilayah setingkat desa.
                    </p>
                    <p className="text-sm md:text-lg font-medium">
                      Program ini dilakukan oleh mahasiswa semester akhir
                      seperti semester 5 atau 6. Mereka akan menjalankan
                      kegiatan belajar, mengabdi, mengajar, dan berbaur dengan
                      masyarakat dimana mereka melakukan KKN. Untuk panduan KKN
                      bisa lihat pada link berikut:
                    </p>
                    <ul className="flex flex-row justify-center py-4 flex-wrap space-x-2 text-sm md:text-base">
                      {downloadMenu.map((menus, i) => (
                        <Link key={i} href={menus.link}>
                          <li
                            className={`flex flex-row content-center px-2 py-2 mt-2 items-center ${menus.color} hover:bg-opacity-80 text-white rounded-sm font-semibold`}
                          >
                            <ArrowDownTrayIcon className="w-4 h-4 mr-2 " />
                            {menus.item}
                          </li>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (status === "authenticated" && role === "dosen") {
    displayDashboard = "";
    router.push("/dosen/dashboard");
  } else {
    displayDashboard = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>
      {displayDashboard}
    </>
  );
}
