import React from "react";
import SidebarDosen from "../../components/sidebarDosen";
import Navbar from "../../components/navbar";
import Link from "next/link";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import Loading from "../loading";
import { useSession } from "next-auth/react";

export default function Kelompok() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;
  const role = Session?.user?.role;
  let displayData = "";

  const fetcher = (url) => fetch(url).then((res) => res.json());

  // First API (item)
  const { data: tables = [], firstApiError } = useSWR(
    id ? `/api/admin/dosen/kelompokQueryDetail?id=${id}` : null,
    fetcher
  );

  // Second API call (item2)
  const { data: tablesList = [], thirdApiError } = useSWR(
    id ? `/api/admin/dosen/kelompokListQuery?id=${id}` : null,
    fetcher
  );

  // Third API call (item3)
  const { data: mahasiswaData, error: secondApiError } = useSWR(
    id && id
      ? `/api/admin/dosen/kelompokMahasiswaQuery?id=${id}&id${id}`
      : null,
    fetcher
  );

  if (firstApiError || secondApiError || thirdApiError) {
    console.error("Error fetching data:", firstApiError || secondApiError);
    return <div>Error loading group details</div>;
  }

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
                <h1>Nilai Kelompok</h1>
              </div>
              <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl w-full">
                <div>
                  {/* {tables && tables.length > 0 ? (
                    tables.map((item2, i) => (
                      <h3
                        className="text-sm md:text-xl font-semibold pb-1 md:pb-3 md:flex justify-end hidden "
                        key={item2.nip}
                      >
                        Lokasi : {item2.lokasi_provinsi}
                      </h3>
                    ))
                  ) : (
                    <h3 className="text-sm md:text-xl font-semibold pb-1 md:pb-3 md:flex justify-end hidden ">
                      Lokasi : Tidak Mempunyai Kelompok
                    </h3>
                  )} */}
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 font-medium px-4 gap-6">
                    {tablesList && tablesList.length > 0 ? (
                      tablesList.map((item, i) => (
                        <div
                          className="bg-white rounded-xl shadow-md flex flex-col justify-between border-2 border-fouthColor"
                          key={item.kelompok_ids}
                        >
                          <h1 className="text-2xl font-bold px-3 py-1">
                            {item.kelompok_name}
                          </h1>
                          <div className="flex flex-row justify-between px-6 pt-4 pb-4 border-y border-fouthColor">
                            <div>
                              <h2>
                                Ketua:{" "}
                                <span className="font-semibold">
                                  {item.ketua_name || "-"}
                                </span>
                              </h2>
                              <h2>
                                Jumlah Anggota:{" "}
                                <span className="font-semibold">
                                  {item.jumlah_mahasiswa || "-"}
                                </span>
                              </h2>
                              <h2>
                                Lokasi:{" "}
                                <span className="font-semibold">
                                  {item.lokasi || "-"}
                                </span>
                              </h2>
                              <h2>
                                Jenis Kelompok:{" "}
                                <span className="font-semibold">
                                  {item.jenis_kelompok
                                    ? item.jenis_kelompok
                                    : "-"}
                                </span>
                              </h2>
                            </div>
                            <div className="flex justify-center items-center w-1/3">
                              <div>
                                {item.foto ? (
                                  <picture>
                                    <img
                                      className="rounded-full"
                                      src={item.foto}
                                      alt="Foto Mahasiswa"
                                    />
                                  </picture>
                                ) : (
                                  <picture>
                                    <img
                                      className="rounded-full"
                                      src={
                                        "https://storage-uinbdg.s3.ap-southeast-3.amazonaws.com/upload_salam/foto_profil_salam/default_user.png"
                                      }
                                      alt="Foto Mahasiswa"
                                    />
                                  </picture>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row justify-between">
                            <div className="w-2/3 text-center py-2">
                              <p>Telp. {item.ketua_telpon || "-"}</p>
                            </div>
                            <div className="w-1/3 text-center bg-fouthColor py-2 rounded-ee-lg text-white hover:bg-fouthColor/90">
                              <button>
                                <Link
                                  href={`/dosen/detailNilai/${item.kelompok_id}`}
                                >
                                  <span className="font-bold px-6 py-2">
                                    detail
                                  </span>
                                </Link>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-xl shadow-md flex flex-col justify-between border-2 border-iconHoverColor">
                        <h1 className="text-2xl font-bold px-3 py-1">
                          KELOMPOK -
                        </h1>
                        <div className="flex flex-row justify-between px-6 pt-4 pb-4 border-y border-iconHoverColor">
                          <div>
                            <h2>
                              Ketua: <span className="font-semibold">-</span>
                            </h2>
                            <h2>
                              Jumlah Anggota:{" "}
                              <span className="font-semibold">-</span>
                            </h2>
                            <h2>Lokasi: -</h2>
                            <h2>
                              Jenis Kelompok:{" "}
                              <span className="font-semibold">-</span>
                            </h2>
                          </div>
                          <div className="flex justify-center items-center w-1/3">
                            <div>
                              <picture>
                                <img
                                  className="rounded-full"
                                  src={
                                    "https://storage-uinbdg.s3.ap-southeast-3.amazonaws.com/upload_salam/foto_profil_salam/default_user.png"
                                  }
                                  alt="Foto Mahasiswa"
                                />
                              </picture>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between">
                          <div className="w-2/3 text-center py-2">
                            <p>Telp. -</p>
                          </div>
                          <div className="w-1/3 text-center bg-iconHoverColor py-2 rounded-ee-lg text-white hover:bg-iconHoverColor/90">
                            <button>
                              <Link href={`#`}>
                                <span className="font-bold px-6 py-2">
                                  detail
                                </span>
                              </Link>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
        <title>Nilai Kelompok</title>
        <meta property="og:title" content="Dashboard" key="title" />
      </Head>

      {displayData}
    </>
  );
}
