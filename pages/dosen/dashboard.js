import React from "react";
import SidebarDosen from "../../components/sidebarDosen";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { DocumentText } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Loading from "../loading";

export default function Dashboard() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;
  const role = Session?.user?.role;
  let displayData = "";

  const downloadMenu = [
    {
      item: "Juknis KKN",
      link: "/",
      color: "bg-[#C70039]",
    },
    {
      item: "Timeline KKN",
      link: "/",
      color: "bg-[#F39F5A]",
    },
    {
      item: "Juknis Pelaporan KKN",
      link: "/",
      color: "bg-[#26577C]",
    },
  ];

  // const dataKelompok = [
  //   {
  //     id: "K1",
  //     namakelompok: "Kelompok 1",
  //     ketua: "Ucup Slankie",
  //     telp: "081356765432",
  //     anggota: "15",
  //   },
  //   {
  //     id: "K2",
  //     namakelompok: "Kelompok 2",
  //     ketua: "Ucup Slankie",
  //     telp: "081356765432",
  //     anggota: "15",
  //   },
  //   {
  //     id: "K3",
  //     namakelompok: "Kelompok 3",
  //     ketua: "Ucup Slankie",
  //     telp: "081356765432",
  //     anggota: "15",
  //   },
  //   {
  //     id: "K4",
  //     namakelompok: "Kelompok 4",
  //     ketua: "Ucup Slankie",
  //     telp: "081356765432",
  //     anggota: "15",
  //   },
  //   {
  //     id: "K4",
  //     namakelompok: "Kelompok 4",
  //     ketua: "Ucup Slankie",
  //     telp: "081356765432",
  //     anggota: "15",
  //   },
  //   {
  //     id: "K4",
  //     namakelompok: "Kelompok 4",
  //     ketua: "Ucup Slankie",
  //     telp: "081356765432",
  //     anggota: "15",
  //   },
  // ];

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "dosen") {
    displayData = (
      <>
        <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
        <div className="flex flex-row justify-start">
          <div className="md:w-auto h-screen">
            <SidebarDosen />
          </div>
          <div className="h-screen w-screen overflow-auto grow">
            <Navbar />
            <div className="px-6 pb-5 w-auto">
              <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                <h1>Dashboard</h1>
              </div>
              <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl w-full">
                {/* <div>
                <h1 className="text-sm md:text-3xl font-semibold pb-1 md:pb-3">
                  Informasi Kelompok
                </h1>
                <div className="grid md:grid-cols-2 xl:grid-cols-4 font-medium px-4 gap-4">
                  {dataKelompok.map((item, i) => (
                    <div className="bg-gray-50 rounded-xl shadow-md" key={i}>
                      <div className="flex flex-row justify-between px-6 pt-4 pb-4">
                        <div>
                          <h1 className="text-2xl font-bold">
                            {item.namakelompok}
                          </h1>
                          <h2>
                            Ketua:{" "}
                            <span className="font-semibold">{item.ketua}</span>
                          </h2>
                          <h2>
                            Jumlah Anggota:{" "}
                            <span className="font-semibold">
                              {item.anggota}
                            </span>
                          </h2>
                        </div>
                        <div className="bg-IjoRumput text-center flex justify-center items-center font-extrabold text-white rounded-full text-3xl py-4 px-6">
                          <h1>{item.id}</h1>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between border-t">
                        <div className="w-2/3 text-center py-2">
                          <p>Telp. {item.telp}</p>
                        </div>
                        <div className="w-1/3 text-center bg-IjoRumput py-2 rounded-ee-lg text-white hover:bg-IjoRumput/80">
                          <Link
                            href={`/dosen/detailKelompok?${item.id}`}
                            className="font-bold px-6 py-2"
                          >
                            Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

                <div className="mt-6 grid md:grid-cols-3  gap-2 ">
                  <div className="md:col-span-2">
                    <h1 className="md:text-3xl font-semibold mb-2 text-center">
                      Timeline
                    </h1>
                    <div className="px-4 pt-2 rounded-md border border-inputColor">
                      <picture>
                        <img
                          src="/images/broschure-dummy.png"
                          alt="timeline"
                          className="w-full rounded-md"
                        />
                      </picture>
                    </div>
                  </div>

                  <div className="text-center mt-3 lg:mt-0 ">
                    <h2 className="font-semibold text-sm md:text-3xl mb-1 md:mb-2">
                      Dokumen KKN
                    </h2>
                    <ul className="md:flex flex-col py-2 flex-wrap text-xs md:text-base md:mx-auto ">
                      {downloadMenu.map((menus, i) => (
                        <li
                          key={i}
                          className={`mb-4 px-5 py-4 ${menus.color} text-white rounded-lg font-semibold drop-shadow-md `}
                        >
                          <h1 className="md:text-2xl text-sm mb-3 text-left">
                            {menus.item}
                          </h1>
                          <Link
                            href={menus.link}
                            className="flex flex-row justify-center items-center bg-white hover:bg-iconHoverColor hover:text-white text-gray-800 py-2 rounded-md"
                          >
                            <ArrowDownIcon className="w-4 h-4 mr-2 " /> Unduh
                            Dokumen
                          </Link>
                        </li>
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
  } else if (status === "authenticated" && role === "mahasiswa") {
    displayData = "";
    router.push("/mahasiswa/dashboard");
  } else {
    displayData = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>
      {displayData}
    </>
  );
}
