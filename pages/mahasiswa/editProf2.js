import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SidebarMahasiswa from "../../components/sidebarMahasiswa";
import Navbar from "../../components/navbar";
import Link from "next/link";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import mutate from "swr";

export default function EditProfil() {
  const router = useRouter();
  const { data : Session, status} = useSession();

  // Fetcher function to use with useSWR
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  // Additional state for API data
  const { data: apiData, error: apiError } = useSWR(
    `/api/mahasiswa/fetchData`,
    fetcher
  );

  // Additional state for API data
  const { data: apiJurData, error: apiJurError } = useSWR(
    `/api/mahasiswa/fetchJurData`,
    fetcher
  );

  const [universitas, setUniversitas] = useState([]);
  const uin = "UNIVERSITAS ISLAM NEGERI SUNAN GUNUNG DJATI BANDUNG";

  const [originalData, setOriginalData] = useState([]);
  const [formData, setFormData] = useState({
    nim: "",
    image: "",
    nama: "",
    jk: "",
    nama_jur: "",
    fakultas: "",
    universitas: "",
    telepon_seluler: "",
    telepon_wali: "",
    foto: "",
  });

  // Update formData with fetched data when apiData changes
  useEffect(() => {
    if (apiData) {
      setFormData({
        nim: apiData.nim || "",
        nama: apiData.nama || "",
        jk: apiData.jk || "",
        nama_jur: apiData.jurusan[0].nama_jur || "", // Assuming index 7 exists
        fakultas: apiData.jurusan[0].fakultas || "", // Assuming index 19 exists
        universitas : apiData.jurusan[0].fakultas ? uin : "",
        telepon_seluler: apiData.telepon_seluler || "",
        telepon_wali: apiData.telepon_rumah || "",
        foto: Session?.user?.image || "",
      });
    }
  }, [apiData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mahasiswa/profilSave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Handle success, e.g., show a success message or redirect
        console.log("Profile updated successfully!");
  
        // Redirect to /mahasiswa/dashboard immediately
        router.push("/mahasiswa/dashboard");
      } else {
        // Handle error, e.g., show an error message
        console.error("Failed to update profile");

      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  if (status === "loading") {
    // Optional: You may want to show a loading indicator while checking authentication status
    return <div>Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    // You may customize the login page route as needed
    router.push('/login');
    return null; // Halt further execution
  }

  return (
    <>
      <Head>
        <title>Profil Mahasiswa</title>
        <meta property="og:title" content="Profil Mahasiswa" key="title" />
      </Head>
      <div className="absolute bg-IjoRumput w-full h-72 -z-20"></div>
      <div className="flex flex-row justify-start">
        <div className="h-screen w-screen overflow-auto grow">
          <div className="px-6 pb-5 w-auto">                
            <div className="mt-20 mb-5 md:mt-10 md:mb-10 font-bold text-2xl md:text-5xl text-white">
              <h1>Profil Mahasiswa</h1>
            </div>
            <div>
            {apiError || apiJurError && (
          <div className="text-red-500">
            Error fetching data: {apiError.message || apiJurError.message || "Error?"}
          </div>
        )}

        {/* {apiData && (
          <div className="mt-5">
            <h1 className="text-lg font-bold">Fetched Data</h1>
            Display the fetched data here
            <pre>{JSON.stringify(apiData, null, 2)}</pre>
            NIM: {apiData.nim}
            Nama : {apiData.nama}
            Jenis Kelamin : {apiData.jk}
            Telepon Seluler : {apiData.telepon_seluler}
            <br/>
            Jurusan : {apiData.jurusan[0].nama_jur ? apiData.jurusan[0].nama_jur : "Hi"}
            Fakultas : {apiData.jurusan[0].fakultas ? apiData.jurusan[0].fakultas : "Hu"}
            Telepon Seluler Orang Tua: {apiData.telepon_rumah}
            Foto : {Session.user.image}
          </div>
        )} */}
            </div>

            <div className="p-4 md:p-9 bg-iceGray rounded-3xl shadow-sm flex flex-col justify-between">

            <form onSubmit={handleSubmit}>
                {/* <div className="flex flex-col items-center md:px-4 md:flex-row md:flex-wrap md:place-items-end">
                  <div
                    className="w-32 h-32 rounded-full border-IjoRumput border-4 bg-cover text-right \"
                    style={{ backgroundImage: `url(${Session.user.image})` }}
                  ></div>
                  <div className="px-5">
                    <label
                      className="block mb-2 text-base font-medium text-gray-900"
                      htmlFor="uploadFoto"
                    >
                      Upload Foto Profil
                    </label>
                    <input
                      id="uploadFoto"
                      className="w-full mb-5 text-lg text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50"
                      type="file"
                    />
                  </div>
                </div> */}
                <div className="py-5">
                  <h1 className="text-lg font-bold">Detail Biodata</h1>
                </div>
                <div className="mb-1 flex items-center text-base">
                  <label htmlFor="nim" className="w-40 md:w-56 font-medium text-gray-900">
                    NIM
                  </label>
                  <input
                    type="text"
                    id="nim"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.nim}
                    onChange={(e) =>
                        setFormData({ ...formData, nim: e.target.value })
                      }
                  />
                </div>
                <div className="mb-1 flex items-center text-base">
                  <label
                    htmlFor="nama"
                    className="w-40 md:w-56 font-medium text-gray-900"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="nama"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.nama}
                    onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                  />
                </div>
                <div className="mb-1 flex items-center text-base">
                  <label
                    htmlFor="gender"
                    className="w-[167px] md:w-[228px] font-medium text-gray-900"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    id="gender"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    value={formData.jk || ""}
                    required
                    onChange={(e) => setFormData({ ...formData, jk: e.target.value })}
                    >
                    <option value="" disabled>Select Gender</option>
                    <option value="L">LAKI - LAKI</option>
                    <option value="P">PEREMPUAN</option>
                  </select>
                </div>
                {/* <div class="mb-1 flex items-center text-base">
                  <label
                    HTMLfor="agama"
                    className="w-40 font-medium text-gray-900"
                  >
                    Agama
                  </label>
                  <input
                    type="text"
                    id="agama"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={agama}
                  />
                </div> */}
                <div className="mb-1 flex items-center text-base">
                  <label
                    htmlFor="jurusan"
                    className="w-40 md:w-56 font-medium text-gray-900"
                  >
                    Program Studi
                  </label>
                  <input
                    type="text"
                    id="jurusan"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.nama_jur}
                    onChange={(e) =>
                        setFormData({ ...formData, nama_jur: e.target.value })
                      }
                  />
                </div>
                <div class="mb-1 flex items-center text-base">
                  <label
                    HTMLfor="fakultas   "
                    className="w-40 md:w-56 font-medium text-gray-900"
                  >
                    Fakultas
                  </label>
                  <input
                    type="text"
                    id="fakultas"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.fakultas}
                    onChange={(e) =>
                        setFormData({ ...formData, fakultas: e.target.value })
                      }
                  />
                </div>
                <div class="mb-1 flex items-center text-base">
                  <label
                    HTMLfor="universitas   "
                    className="w-40 md:w-56 font-medium text-gray-900"
                  >
                    Universitas
                  </label>
                  <input
                    type="text"
                    id="universitas"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.universitas}
                    onChange={(e) =>
                        setFormData({ ...formData, universitas: e.target.value })
                      }
                  />
                </div>
                {/* <div class="mb-2 flex items-center text-base">
                  <label
                    HTMLfor="angkatan"
                    className="w-40 font-medium text-gray-900"
                  >
                    Angkatan
                  </label>
                  <input
                    type="text"
                    id="angkatan"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={angkatan}
                  />
                </div> */}
                {/* <div class="mb-2 flex items-center text-base">
                  <label
                    HTMLfor="email"
                    className="w-40 font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={email}
                  />
                </div> */}
                <div class="mb-2 flex items-center text-base">
                  <label
                    HTMLfor="telp"
                    className="w-40 md:w-56 font-medium text-gray-900"
                  >
                    Nomor Telpon Mahasiswa
                  </label>
                  <input
                    type="text"
                    id="telp"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.telepon_seluler}
                    onChange={(e) =>
                        setFormData({ ...formData, telepon_seluler: e.target.value })
                      }
                  />
                </div>
                <div class="mb-2 flex items-center text-base">
                  <label
                    HTMLfor="telp"
                    className="w-40 md:w-56 font-medium text-gray-900"
                  >
                    Nomor Telpon Orang Tua
                  </label>
                  <input
                    type="text"
                    id="telp"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={formData.telepon_wali}
                    onChange={(e) =>
                        setFormData({ ...formData, telepon_wali: e.target.value })
                      }
                  />
                </div>
                {/* <div class="mb-2 flex items-center text-base">
                  <label
                    HTMLfor="alamat"
                    className="w-40 font-medium text-gray-900"
                  >
                    Alamat
                  </label>
                  <input
                    type="text"
                    id="alamat"
                    className="w-full text-sm shadow-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    value={alamat}
                  />
                </div> */}
                <div className="mt-5">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      SIMPAN
                    </button>
                </div>
            </form>           
                            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
