import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { cariKata } from "@/lib/listKata";
import { useRouter } from "next/router";
import Loading from "../loading";

export default function Profil() {
  const { data: Session, status } = useSession();
  const router = useRouter();

  const id = Session?.user?.username;
  const image = Session?.user?.image;

  let displayProfil = "";

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables = [], error } = useSWR(
    `/api/mahasiswa/profilQuery?nim=${id}`,
    fetcher
  );
  const { data: tables2 = [], error2 } = useSWR(
    `/api/mahasiswa/fetchSks`,
    fetcher
  );
  const { data: tables3 = [], error3 } = useSWR(
    `/api/mahasiswa/kelompokCheck?nim=${id}`,
    fetcher
  );

  // Initialize state for kelompok_id
  const [kId, setKId] = useState(null);

  useEffect(() => {
    if (tables3 && tables3.length > 0) {
      setKId(tables3[0]?.kelompok_id);
    }
  }, [tables3]);

  // useEffect(() => {
  //   console.log("kId:", kId);
  // }, [kId]);

  const { data: data2 = [], error4 } = useSWR(
    kId ? `/api/admin/setting/kelompokDetailQuery?id=${kId}` : null,
    fetcher
  );

  const mapNumericToAlphabet = (numericGrade) => {
    if (numericGrade === null) {
      return "-";
    } else if (numericGrade >= 85 && numericGrade <= 100) {
      return "A";
    } else if (numericGrade >= 75 && numericGrade <= 84) {
      return "B";
    } else if (numericGrade >= 60 && numericGrade <= 74) {
      return "C";
    } else if (numericGrade >= 50 && numericGrade <= 59) {
      return "D";
    } else {
      return "E";
    }
  };

  if (tables === null) {
    // Optional: You may want to show a loading indicator while checking authentication status
    return <Loading />;
  }

  const nilaiHuruf = ["A", "B", "C"];
  let nilaiKKN = "-";
  let nilaiHurufKKn = "-";
  const lastIndex = tables2[tables2.length - 1];

  // if (lastIndex.total_sks > 124) {
  //   for (const semester of tables2) {
  //     for (const mk of semester.detail_mk) {
  //       if (cariKata.some((kata) => mk.nama_mk.toLowerCase().includes(kata))) {
  //         nilaiKKN = mk.nilai_angka;
  //         nilaiHurufKKn = mk.nilai_huruf;
  //       }
  //     }
  //   }
  // }

  const role = Session?.user?.role;

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "mahasiswa") {
    for (const semester of tables2) {
      semester.detail_mk?.some((mk) =>
        // namaMk.includes(mk.nama_mk.toLowerCase()) && nilaiHuruf.includes(mk.nilai_huruf)
        // /kuliah kerja || kerja || kkm || kkn || field || kerja mahasiswa || nyata mahasiswa || kerjanyata || kerja-nyata/i.test(
        //   mk.nama_mk.toLowerCase()
        // ) && nilaiHuruf.includes(mk.nilai_huruf.toLowerCase())
        {
          if (
            cariKata.some((kata) => mk.nama_mk.toLowerCase().includes(kata)) &&
            nilaiHuruf.includes(mk.nilai_huruf)
          ) {
            nilaiKKN = mk.nilai_angka;
            nilaiHurufKKn = mk.nilai_huruf;
          }
        }
      );
    }

    displayProfil = (
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
                <h1>Profil Mahasiswa</h1>
              </div>
              <div className="p-4 md:p-9 bg-white rounded-3xl shadow-md flex justify-between">
                <div className="flex flex-col items-center md:px-4 md:flex-row md:flex-wrap md:place-items-end">
                  <div
                    className="w-32 h-32 rounded-full border-inputColor border-4 bg-cover text-right"
                    style={{ backgroundImage: `url(${image})` }}
                  ></div>
                  {tables.map((table) => (
                    <div
                      className="px-6 py-3 text-center md:text-left"
                      key={table.nim}
                    >
                      <h1 className="text-3xl md:text-5xl font-bold">
                        {table.name}
                      </h1>
                      <h2 className="px-1 text-sm md:text-lg font-medium">
                        {table.nim} | {table.jurusan}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap space-y-3 md:space-y-0 md:space-x-2 justify-around py-3 md:py-5">
                {tables.map((table) => (
                  <div
                    className="md:w-[49%] bg-white rounded-3xl shadow-lg text-base md:text-lg font-medium p-6"
                    key={table.nim}
                  >
                    <h1 className="text-xl md:text-2xl font-bold mb-3">
                      Biodata Diri
                    </h1>
                    <div className="border-t border-gray-100 mt-4">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Program Studi
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {table.jurusan}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Fakultas
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {table.fakultas}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Universitas
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {table.universitas}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Nomor Telepon Orang Tua
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {table.telpon_wali}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Nomor Telepon Mahasiswa
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {table.telpon}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Jenis Kelamin
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {table.gender === "L"
                              ? "Laki-laki"
                              : table.gender === "P"
                              ? "Perempuan"
                              : "-"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                ))}

                <div className="md:w-[49%] text-base md:text-lg font-medium">
                  <div className="bg-iconHoverColor rounded-3xl shadow-lg p-6 mb-4">
                    <h1 className="text-xl  md:text-2xl font-bold mb-3">
                      Nilai KKN
                    </h1>
                    {tables.map((table) => (
                      <div
                        className="flex justify-center space-x-2 flex-wrap"
                        key={table.nim}
                      >
                        <div className="p-5 border-white border rounded-md text-center">
                          <h1 className="font-semibold">Nilai Angka :</h1>
                          <h2 className="text-3xl font-bold">
                            {table.nilai != null ? (
                              <span>{table.nilai}</span>
                            ) : (
                              <span>{nilaiKKN}</span>
                            )}
                          </h2>
                        </div>
                        <div className="p-5 border-white border rounded-md text-center">
                          <h1 className="font-semibold">Nilai Huruf :</h1>
                          <h2 className="text-3xl font-bold">
                            {table.nilai != null ? (
                              mapNumericToAlphabet(table.nilai)
                            ) : (
                              <span>{nilaiHurufKKn}</span>
                            )}
                          </h2>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h1 className="text-xl md:text-2xl font-bold mb-3">
                      Informasi KKN
                    </h1>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Kelompok
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {data2[0]?.kelompok_name != null ? (
                              <span>{data2[0]?.kelompok_name}</span>
                            ) : (
                              <span> - </span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Jenis KKN
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {data2[0]?.jenis_kelompok != null ? (
                              <span>{data2[0]?.jenis_kelompok}</span>
                            ) : (
                              <span> - </span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="border-t border-gray-100">
                      <dl className="divide-y divide-gray-100">
                        <div className="md:px-4 md:py-3 grid grid-cols-3 gap-4 px-0">
                          <dt className="font-semibold leading-6 text-gray-900">
                            Lokasi KKN
                          </dt>
                          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                            {data2[0]?.kota != null ||
                            data2[0]?.provinsi != null ||
                            data2[0]?.negara != null ? (
                              <span>
                                {data2[0]?.kota}, {data2[0]?.provinsi}{" "}
                                {data2[0]?.negara}{" "}
                              </span>
                            ) : (
                              <span> - </span>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    {tables3[0]?.kelompok_id != null ? (
                      <div className="border-t border-gray-100">
                        <dl className="divide-y divide-gray-100 text-right py-4">
                          <Link
                            href={"/mahasiswa/kelompok"}
                            className="px-5 py-2 bg-inputColor rounded-md text-white hover:bg-iconHoverColor"
                          >
                            Lihat Detail Kelompok
                          </Link>
                        </dl>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else if (status === "authenticated" && role === "dosen") {
    displayProfil = "";
    router.push("/dosen/dashboard");
  } else {
    displayProfil = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Profil Mahasiswa</title>
        <meta property="og:title" content="Profil Mahasiswa" key="title" />
      </Head>
      {displayProfil}
    </>
  );
}
