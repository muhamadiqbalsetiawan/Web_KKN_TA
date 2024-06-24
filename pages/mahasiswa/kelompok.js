import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import ReactModal from "react-modal";
import Head from "next/head";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Notify from "@/components/notify";
import { useRouter } from "next/router";
import Loading from "../loading";

export default function KelompokKKN() {
  const router = useRouter();
  const { data: Session, status } = useSession();

  const id = Session?.user?.username;
  let displayKelompok = "";

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: tables2 = [], error3 } = useSWR(
    `/api/mahasiswa/kelompokCheck?nim=${id}`,
    fetcher
  );

  // Initialize state for kelompok_id
  const [kId, setKId] = useState(null);

  useEffect(() => {
    if (tables2 && tables2.length > 0) {
      setKId(tables2[0].kelompok_id);
    }
  }, [tables2]);

  // useEffect(() => {
  //   console.log("kId:", kId);
  // }, [kId]);

  // Use kelompokId to fetch peserta and data2
  const { data: peserta = [], error } = useSWR(
    kId ? `/api/admin/mahasiswa/kelompokMahasiswaDetailQuery?id=${kId}` : null,
    fetcher
  );
  const { data: data2 = [], error2 } = useSWR(
    kId ? `/api/admin/setting/kelompokDetailQuery?id=${kId}` : null,
    fetcher
  );

  const [isChooseModal, setChooseModal] = useState(false);
  const [nim, setNim] = useState("");

  const openChooseModal = () => {
    setChooseModal(true);
  };
  const closeChooseModal = () => {
    setChooseModal(false);
  };
  const handleOpenModal = (id) => {
    openChooseModal();
    setNim(id)
  };

  // Destructure specific properties from data2
  const {
    jenis_kelompok,
    kelompok_name,
    ketua_name,
    ketua_jurusan,
    ketua_telpon,
    dosen_name,
    telpon_dosen,
  } = data2;

  const handleSubmit = async () => {
    try {
      // Lakukan pengiriman data ke backend
      const response = await fetch("/api/mahasiswa/Ketua", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nim: nim,
          kelompok: data2[0].kelompok_name, // Mengambil nama kelompok dari data pertama (asumsi hanya ada satu data)

          // Anda juga dapat menyertakan data tambahan yang diperlukan dalam request
        }),
      });

      // Periksa status response
      if (response.ok) {
        // Handle response jika sukses (misalnya, tampilkan pesan sukses atau lakukan tindakan lain)
        console.log("Pengajuan berhasil!");
        // Lakukan aksi lain setelah pengajuan berhasil
      } else {
        // Handle response jika gagal (misalnya, tampilkan pesan error)
        console.error("Pengajuan gagal.");
        // Lakukan tindakan lain jika diperlukan
      }
    } catch (error) {
      // Tangani error jika fetch gagal (misalnya, jaringan tidak terhubung)
      console.error("Error:", error);
      // Lakukan tindakan lain jika diperlukan
    } finally {
      // Setelah pengiriman selesai, tutup modal
      closeChooseModal();
    }
  };

  if (error || error2) {
    return <div>Error loading group details</div>;
  }

  if (!peserta || !data2) {
    return <div>Loading... Data Error</div>;
  }

  // Notifikasi Pilih Ketua
  let notify = false;

  if (
    (data2[0]?.ketua_name === "" || data2[0]?.ketua_name === null) &&
    data2[0]?.jenis_kelompok === "SISDAMAS" || data2[0]?.jenis_kelompok === "KKN SISDAMAS" || data2[0]?.jenis_kelompok === "KKN REGULER"
  ) {
    notify = true;
  } else {
    notify = false;
  }

  const role = Session?.user?.role;

  if (status === "loading") {
    return <Loading />;
  } else if (status === "authenticated" && role === "mahasiswa") {
    if (tables2[0]?.kelompok_id !== null) {
      displayKelompok = (
        <>
          <div className="absolute bg-primaryColor w-full h-72 -z-20"></div>
          <div className="flex flex-row justify-start">
            <div className="w-auto h-screen">
              <SidebarMahasiswa />
            </div>
            <div className="overflow-auto h-screen grow">
              <Navbar />
              <div className="px-6 pb-5 w-auto font-medium">
                {notify ? (
                  <button onClick={() => handleOpenModal(id)}>
                    <Notify />
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="mt-20 mb-5 md:mt-28 md:mb-10 font-bold text-2xl md:text-5xl text-white">
                  <h1>Kelompok KKN</h1>
                </div>
                <div className="md:flex flex-row space-y-3 md:space-y-0 md:space-x-2 lg:space-x-4 box-border">
                  <div className="md:hidden p-2 bg-white shadow-lg rounded-xl">
                    <div className="flex flex-col justify-evenly w-full space-y-2">
                      <div className="border border-slate-500 rounded-lg text-center p-1">
                        <h1 className="font-bold text-base border-b-[1px] border-slate-400 mb-1">
                          Ketua Kelompok
                        </h1>
                        {data2 && data2.length > 0 ? (
                          data2.map((data2, i) => (
                            <div key={i}>
                              <p className="font-semibold text-sm">
                                {data2.ketua_name || "-"} -{" "}
                                {data2.ketua_jurusan || "-"} -{" "}
                                {data2.ketua_telpon || "-"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="font-semibold text-sm">
                            Nama Ketua:- / Jurusan:- / Telpon:-
                          </p>
                        )}
                      </div>
                      {notify ? (
                        <button
                          type="button"
                          onClick={() => handleOpenModal(id)}
                          className="px-5 py-2 bg-sky-700 hover:bg-sky-900 font-bold text-white rounded-md text-base"
                        >
                          Ajukan Ketua Kelompok
                        </button>
                      ) : (
                        <></>
                      )}
                      <div className="border border-slate-500 rounded-lg text-center font-semibold p-1">
                        <h1 className="font-bold text-base border-b-[1px] border-slate-400 mb-1">
                          Dosen Pembimbing
                        </h1>
                        {data2 && data2.length > 0 ? (
                          data2.map((data2, i) => (
                            <div key={i}>
                              <p className="text-sm">
                                {data2.dosen_name || "-"}
                              </p>
                              <p className="text-sm">
                                Kontak: {data2.telpon_dosen || "-"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div>
                            <p className="text-sm">Dosen Pembimbing: -</p>
                            <p className="text-sm">Kontak: - </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 md:p-6 bg-white shadow-lg rounded-xl md:w-4/5">
                    <div className="box-border mb-3">
                      {data2 && data2.length > 0 ? (
                        data2.map((data2, i) => (
                          <div key={i}>
                            <h1 className="text-lg md:text-3xl font-bold">
                              {data2.jenis_kelompok || "-"}
                            </h1>
                            <h2 className="md:text-xl font-semibold">
                              {data2.kelompok_name || "-"}
                            </h2>
                            <div className="font-medium text-lg">
                              {data2.kelurahan !== null && (
                                <span>{`${data2.kelurahan}`}</span>
                              )}
                              {data2.kecamatan !== null && (
                                <span>, {`${data2.kecamatan}`}</span>
                              )}
                              {data2.kota !== null && (
                                <span>, {`${data2.kota}`}</span>
                              )}
                              {data2.provinsi !== null && (
                                <span>, {`${data2.provinsi}`}</span>
                              )}
                              {data2.negara !== null && (
                                <span>, {`${data2.negara}`}</span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>
                          <h1 className="text-lg md:text-3xl font-bold">
                            Jenis Kelompok : -
                          </h1>
                          <h2 className="md:text-xl font-semibold">
                            Kelompok : -
                          </h2>
                        </div>
                      )}
                    </div>
                    <div className="box-border md:py-3 mb-3 lg:text-base text-sm overflow-x-auto">
                      <table className="w-full rounded-xl">
                        <thead>
                          <tr className="bg-primaryColor text-white">
                            <th className="rounded-tl-lg p-2 lg:p-4">No</th>
                            <th className="px-6 p-2 lg:p-4">Profil</th>
                            <th className="px-6 p-2 lg:p-4">Nama</th>
                            <th className="px-6 p-3 lg:p-4">Program Studi</th>
                            <th className="px-6 p-3 lg:p-4">Fakultas</th>
                            <th className="rounded-tr-lg p-3 lg:p-4">
                              Nomor HP
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-center">
                          {peserta && peserta.length > 0 ? (
                            peserta.map((item, i) => (
                              <tr key={i} className="border-y border-slate-300">
                                <td className="py-1 px-1 lg:p-3">{i + 1}</td>
                                <td className="py-2 lg:p-3 flex justify-center">
                                  <picture>
                                    <img
                                      src={
                                        item.foto ||
                                        "https://storage-uinbdg.s3.ap-southeast-3.amazonaws.com/upload_salam/foto_profil_salam/default_user.png"
                                      }
                                      alt="profilFoto"
                                      className="w-9 h-9 rounded-full"
                                    />
                                  </picture>
                                </td>
                                <td className="py-1 px-3 lg:p-3">
                                  {item.name}
                                </td>
                                <td className="py-1 px-3 lg:p-3">
                                  {item.jurusan}
                                </td>
                                <td className="py-1 px-3 lg:p-3">
                                  {item.fakultas}
                                </td>
                                <td className="py-1 px-3 lg:p-3">
                                  {item.telpon || "-"}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-y border-slate-300">
                              <td className="py-1 px-1 lg:p-3">-</td>
                              <td className="py-2 lg:p-3 flex justify-center">
                                <picture>
                                  <img
                                    alt="image"
                                    className="w-9 h-9 rounded-full"
                                  />
                                </picture>
                              </td>
                              <td className="py-1 px-3 lg:p-3">-</td>
                              <td className="py-1 px-3 lg:p-3">-</td>
                              <td className="py-1 px-3 lg:p-3">-</td>
                              <td className="py-1 px-3 lg:p-3">-</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="hidden p-4 lg:p-5 bg-white shadow-lg md:w-1/5 lg:2/5 rounded-xl md:flex flex-col items-center">
                    <div className="mt-5 lg:mt-10 flex flex-col justify-center w-full">
                      {data2 && data2.length > 0 ? (
                        data2.map((data2, i) => (
                          <div key={i}>
                            {notify ? (
                              <button
                                type="button"
                                onClick={() => handleOpenModal(id)}
                                className="px-5 py-2 bg-sky-700 hover:bg-sky-900 font-bold text-white rounded-md md:text-base lg:text-xl"
                              >
                                Ajukan Ketua Kelompok
                              </button>
                            ) : (
                              <></>
                            )}

                            <div className="border border-slate-500 mt-3 rounded-lg text-center text-base lg:text-xl p-3">
                              <h1 className="font-bold mb-2 border-b-[1px] border-slate-400">
                                Ketua Kelompok
                              </h1>
                              <p className="font-semibold text-sm">
                                {data2.ketua_name}
                              </p>
                              <p className="font-semibold text-sm">
                                {data2.ketua_jurusan}
                              </p>
                              <p className="font-semibold text-sm">
                                Kontak: {data2.ketua_telpon}
                              </p>
                            </div>
                            <div className="border border-slate-500 mt-3 rounded-lg text-center text-base lg:text-xl font-semibold p-3">
                              <h1 className="font-bold mb-2 border-b-[1px] border-slate-400">
                                Dosen Pembimbing
                              </h1>
                              <p className="text-sm">{data2.dosen_name}</p>
                              <p className="text-sm">
                                Kontak: {data2.telpon_dosen}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>
                          <div className="border border-slate-500 mt-3 rounded-lg text-center text-base lg:text-xl p-3">
                            <h1 className="font-bold mb-2 border-b-[1px] border-slate-400">
                              Ketua Kelompok
                            </h1>
                            <p className="font-semibold text-sm">Nama: -</p>
                            <p className="font-semibold text-sm">Jurusan: -</p>
                            <p className="font-semibold text-sm">Kontak: -</p>
                          </div>
                          <div className="border border-slate-500 mt-3 rounded-lg text-center text-base lg:text-xl font-semibold p-3">
                            <h1 className="font-bold mb-2 border-b-[1px] border-slate-400">
                              Dosen Pembimbing
                            </h1>
                            <p className="text-sm">-</p>
                            <p className="text-sm">Kontak: -</p>
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
    } else {
      displayKelompok = "";
      router.push("/mahasiswa/dashboard");
    }
  } else if (status === "authenticated" && role === "dosen") {
    displayKelompok = "";
    router.push("/dosen/dashboard");
  } else {
    displayKelompok = "";
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Kelompok Mahasiswa</title>
        <meta property="og:title" content="Kelompok Mahasiswa" key="title" />
      </Head>
      {displayKelompok}
      <ReactModal
        isOpen={isChooseModal}
        onRequestClose={closeChooseModal}
        contentLabel="Konfirmasi Pengajuan"
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "80%",
            height: "60%",
            margin: "auto",
            display: "flex",
            justifyContent: "center",
          },
        }}
      >
        <div className="flex flex-col justify-center items-center font-medium text-lg mt-6">
          {/* <h1 className="font-bold">Ketua Kelompok</h1> */}
          <h1 className="font-bold mb-5">
            Apakah <span className="font-black">Anda ({tables2[0]?.mahasiswa_name})</span> Yakin Ingin
            Mengajukan Diri Sebagai Ketua Kelompok?
          </h1>
          <form>
            <div className="flex flex-row space-x-3 justify-center mb-3">
              <button
                type="button"
                onClick={closeChooseModal}
                className="bg-red-600 hover:bg-red-700 px-5 py-1 text-white rounded-lg text-sm md:text-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={() => handleSubmit(nim)}
                className="bg-green-600 hover:bg-green-700 px-5 py-1 text-white rounded-lg text-sm md:text-lg"
              >
                Input
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
    </>
  );
}
