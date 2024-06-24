import { useRouter } from "next/router";
import Link from "next/link";
import { IoChevronBackOutline } from "react-icons/io5";

export default function DetailKelompok() {
  const router = useRouter();
  const { id, kelompok, jenis, lokasi, peserta, dosen } = router.query; // Mengakses nilai dari query parameter 'id'

  // Gunakan nilai 'id' untuk mendapatkan data terkait dari tabel atau sumber data lainnya

  // Pastikan peserta yang diterima merupakan array
  const participants = Array.isArray(peserta) ? peserta : [peserta];

  return (
    // <div>
    //   <h1>Detail Kelompok Mahasiswa {id} </h1>
    //   <p>kelompok: {kelompok}</p>
    //   <p>jenis: {jenis}</p>
    //   <p>lokasi: {lokasi}</p>
    //   <h2>Peserta:</h2>
    //   <ul>
    //     {participants.map((participant, i) => (
    //       <li key={i}>
    //         Nama: {participant.nama}, Kelamin: {participant.kelamin}
    //       </li>
    //     ))}
    //   </ul>
    // </div>

    <>
      <div className="absolute bg-IjoRumput h-screen w-screen">
        <div className="absolute mx-2 mt-4 bg-white rounded-full p-2 drop-shadow-xl">
          <Link href="/admin/mahasiswa/kelompok" className="text-xl">
            <IoChevronBackOutline />
          </Link>
        </div>
        <div className="flex justify-center items-center mt-8">
          <h1 className="text-white text-4xl font-bold">Detail Kelompok</h1>
        </div>
        <div class="absolute px-5 md:left-32 md:right-32 md:top-24 py-2 rounded-xl bg-iceGray">
          <div className="flex justify-between h-auto w-auto">
            <div className="bg-white h-full w-1/3 grid justify-center items-center rounded-lg py-3 px-3 my-8">
              <div className="font-bold text-3xl flex items-center justify-center my-4">
                <picture>
                  <img
                    src="/nav-logo2.png"
                    alt="Logo UIN"
                    className="md:w-[90px]"
                  />
                </picture>
              </div>
              <div>
                <h1 className="font-bold text-4xl flex items-center justify-center mb-3 text-center">
                  {kelompok}
                </h1>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Jenis KKN
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {jenis}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Lokasi KKN
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {lokasi}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    Dosen Pembimbing:
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    {dosen}
                  </p>
                  <h2 className="text-xl font-semibold flex items-center justify-center text-center">
                    No Telepon:
                  </h2>
                  <p className="text-lg flex items-center justify-center text-center">
                    089645272874
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white w-2/3 grid justify-center items-center ml-8 py-8 my-8 rounded-xl">
              <div className="relative overflow-x-auto overflow-y-auto bg-white max-h-80">
                <table className=" text-lg text-gray-500 dark:text-gray-400 min-w-full w-full text-left rtl:text-right ">
                  <thead className=" text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-center">
                    <tr className="">
                      <th scope="col" className="py-2 px-4">
                        No
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Nama
                      </th>
                      <th scope="col" className="py-2 px-4">
                        NIM
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Jurusan
                      </th>
                      <th scope="col" className="py-2 px-4">
                        Fakultas
                      </th>
                      <th scope="col" className="py-2 px-4">
                        No Telepon
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                    <tr>
                      <td scope="col" className="px-4">
                        1
                      </td>
                      <td scope="col" className="px-4">
                        Muhamad Ramdan
                      </td>
                      <td scope="col" className="px-4">
                        1207050179
                      </td>
                      <td scope="col" className="px-4">
                        Teknik Informatika
                      </td>
                      <td scope="col" className="px-4">
                        Sains dan Teknologi
                      </td>
                      <td scope="col" className="px-4">
                        089647264291
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
