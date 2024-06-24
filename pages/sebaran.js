import React from "react";
import Header from "../components/header";
import Copyright from "../components/copyright";
import Head from "next/head";

const sebaranKKN = [
  {
    jenisKKN: "KKN Kolaboratif Luar Negeri Mandiri",
    deskripsi:
      "KKN yang diselenggarakan di luar negeri berkolaborasi dengan pihak mitra dengan pembiayaan dari mahasiswa secara Mandiri. Waktu, metode dan output disesuaikan dengan kesepakatan LP2M dengan pihak mitra.",
    lokasi: "Malaysia, Thailand, Jepang, Korea, Australia, Saudi Arabia.",
    peserta: "Mahasiswa/i PTKIN Seluruh Indonesia",
  },
  {
    jenisKKN: "KKN Kolaboratif Dalam Negeri Mandiri",
    deskripsi:
      "KKN yang diselenggarakan di dalam negeri, berkolaborasi dengan Kampus lain yang telah menjalin kesepakatan untuk bekerjasama KKN dengan UIN Bandung. Masing-masing kampus saling bertukar peserta KKN. Dimana pembiayaan KKN-nya berasal dari Mahasiswa secara Mandiri. Waktu, tempat dan out put KKN mengikuti pihak mitra kampus.",
    lokasi:
      "Cirebon, Purwokerto, Semarang, Yogyakarta, Mataram, Kendari, Monado, Pontianak, Lampung, Padang dan Bukittinggi.",
    peserta: "Mahasiswa/i PTKIN Seluruh Indonesia",
  },
  {
    jenisKKN: "KKN Nusantara Moderasi Beragama",
    deskripsi:
      "KKN yang diselenggarakan oleh Kementerian Agama berkolaborasi dengan  Kampus PTKIN se-Indonesia. Lokasi, Metode dan outcome KKN ini ditentukan oleh Kemenag. Demikian pula peserta lainnya merupakan utusan tiap kampus yang dibatasi dan terseleksi.",
    lokasi: "Belum Ditentukan",
    peserta: "Mahasiswa/i PTKIN Seluruh Indonesia",
  },
  {
    jenisKKN: "KKN Tematik",
    deskripsi:
      "KKN yang oleh LP2M bermitra, dengan pihak lain yang telah melakukan nota kesepakatan kerjasama, memiliki program khusus dengan target tertentu. Mengenai Metode, Waktu dan Tempat disesuaikan dengan program pihak dan disepakati oleh LP2M. Pihak mitra yang sudah berjalan adalah BPJPH melalui Pusat Halal. Disamping tidak menutup kemungkinan ada pihak mitra lainnya.",
    lokasi: "Menyesuaikan",
    peserta: "Mahasiswa/i UIN Sunan Gunung Djati Bandung",
  },
  {
    jenisKKN: "KKN Reguler",
    deskripsi:
      "KKN yang diselenggarakan oleh LP2M, menggunakan metode KKN Sisdamas (Berbasis Pemberdayaan Masyarakat), Lokasi KKN mengikuti himbauan Kemenag dengan waktu dan outcome ditentukan oleh LP2M.",
    lokasi: "Sekitar Kampus (wilayah Jawa Barat)",
    peserta: "Mahasiswa/i UIN Sunan Gunung Djati Bandung",
  },
  {
    jenisKKN: "KKN Terpadu",
    deskripsi:
      "KKN yang waktunya beririsan atau berbeda dari waktu KKN Reguler karena berbenturan dengan PPM/PKL. KKN ini merupakan pengajuan dari Fakultas/ Prodi yang dibahas bersama LP2M dan disetujui bersama. Ketentuan Lokasi, Metode, Waktu, dan Out putnya termasuk dalam pembahasan yang disepakati Fakultas/Prodi dengan LP2M. ",
    lokasi: "Menyesuaikan",
    peserta: "Mahasiswa/i UIN Sunan Gunung Djati Bandung",
  },
  {
    jenisKKN: "KKN Responsif",
    deskripsi:
      "KKN yang diselenggarakan untuk merespons peserta KKN yang sedang hamil, menyusui atau dalam kondisi sakit berat (dibuktikan dengan keterangan dokter). KKN ini menggunakan metode KKN Dari Rumah (KKN-DR), dengan waktu dan output ditentukan LP2M.",
    lokasi: "Menyesuaikan",
    peserta: "Mahasiswa/i UIN Sunan Gunung Djati Bandung",
  },
  {
    jenisKKN: "KKN Konversi",
    deskripsi:
      "KKN yang diselenggarakan dalam kerangka MBKM atau Kegiatan pengabdian di luar yang diprogramkan oleh LP2M, namun muatan dan kualitas pengabdiannya jelas seukuran dengan pemenuhan tugas KKN. Untuk pengusulan jenis KKN ini peserta diharuskan menyusun proposal yang diseminarkan dihadapan Tim LP2M, untuk diuji tingkat kelayakannya.",
    lokasi: "Menyesuaikan",
    peserta: "Mahasiswa/i UIN Sunan Gunung Djati Bandung",
  },
];

export default function Sebaran() {
  return (
    <>
      <Head>
        <title>KKN UIN SUNAN GUNUNG DJATI BANDUNG</title>
      </Head>
      <Header />
      <div className="w-full h-[160px] lg:h-[320px] bg-gradient-to-b from-cyan-700 absolute to-transparent z-30"></div>
      <div
        style={{ backgroundImage: "url(/images/2.jpg)" }}
        className="w-full h-[200px] md:h-[280px] lg:h-[360px] bg-center bg-cover duration-300 blur-sm relative"
      ></div>
      <div className="absolute z-20 w-full top-24 lg:top-44">
        <div className="text-center">
          <h1 className="font-bold md:font-extrabold text-5xl md:text-8xl text-white">
            Sebaran Lokasi
          </h1>
        </div>
      </div>

      {/* Mobile */}
      <section className="block lg:hidden">
        <div className="px-5 py-7 font-medium text-justify">
          {sebaranKKN.map((item, i) => (
            <div key={i} className="mb-3">
              <h1 className="font-extrabold">
                <span>{i + 1}</span>. {item.jenisKKN}
              </h1>
              <div className="px-4">
                <p><span className="font-bold">Lokasi</span> : {item.lokasi}</p>
                <p><span className="font-bold">Peserta</span> : {item.peserta}</p>
                <p>{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Web */}
      <section className="hidden lg:block">
        <div className="px-10 py-7">
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-lg font-medium text-left rtl:text-right text-gray-900">
              <thead className="text-white uppercase bg-primaryColor text-xl">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Jenis KKN
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Deskripsi
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Lokasi KKN
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Peserta KKN
                  </th>
                </tr>
              </thead>
              <tbody>
                {sebaranKKN.map((item, index) => (
                  <tr key={index} className="bg-white border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {index + 1}
                    </th>
                    <th
                      scope="row"
                      className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap"
                    >
                      {item.jenisKKN}
                    </th>
                    <td className="px-6 py-4">{item.deskripsi}</td>
                    <td className="px-6 py-4">{item.lokasi}</td>
                    <td className="px-6 py-4">{item.peserta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Copyright />
    </>
  );
}
