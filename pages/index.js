import Map from "../components/Map";
import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Link from "next/link";
import Copyright from "../components/copyright";
import Head from "next/head";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { IoLocation, IoMailOutline } from "react-icons/io5";
import { FaGlobe, FaInstagram, FaPhone, FaYoutube } from "react-icons/fa6";

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoSLideInterval, setAutoSlideInterval] = useState(null);

  const imageSlides = [
    {
      url: "/images/headerKKN.png",
    },
    {
      url: "/images/1.png",
    },
    {
      url: "/images/2.png",
    },
    {
      url: "/images/3.png",
    },
    {
      url: "/images/4.png",
    },
  ];

  const nextSlide = () => {
    const isLastSlide = currentIndex === imageSlides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    setAutoSlideInterval(interval);

    return () => {
      clearInterval(autoSLideInterval);
    };
  }, [currentIndex]);

  const icons = [
    {
      href: "https://www.instagram.com/lp2m.sgdofficial/",
      icon: FaInstagram,
    },
    {
      href: "https://www.youtube.com/@lp2muinsgdbandung791",
      icon: FaYoutube,
    },
    {
      href: "https://lp2m.uinsgd.ac.id/",
      icon: FaGlobe,
    },
  ];

  const kampuss = [
    {
      kampus: "KAMPUS 1",
      jalan:
        "Jalan A.H. Nasution No. 105, Cipadung, Cibiru, Kota Bandung, Jawa Barat 40614",
    },
    {
      kampus: "KAMPUS 2",
      jalan:
        "Jalan Cimencrang, Panyileukan, Cimencrang, Gedebage, Kota Bandung, Jawa Barat 40292",
    },
    {
      kampus: "KAMPUS 3",
      jalan: "Jalan Cileunyi Kabupaten Bandung, Jawa Barat 40292",
    },
  ];

  let warna = "white";

  return (
    <>
      <Head>
        <title>KKN UIN SUNAN GUNUNG DJATI BANDUNG</title>
      </Head>
      <Header />

      <main>
        {/* Atas */}
        <section>
          <div className="h-[240px] w-full bg-gradient-to-b from-primaryColor to-transparent absolute z-30"></div>
          <div className="h-[80px] w-full bg-gradient-to-b from-primaryColor to-transparent absolute z-20"></div>
          <div className="h-[60px] w-full bg-gradient-to-b from-primaryColor to-transparent absolute z-10"></div>
          <div
            style={{ backgroundImage: `url(${imageSlides[currentIndex].url})` }}
            className="w-full xl:h-screen bg-center bg-cover bg-no-repeat duration-300 absolute -z-10 opacity-10 blur-sm"
          ></div>
          <div
            style={{ backgroundImage: `url(${imageSlides[currentIndex].url})` }}
            className="h-[260px] bg-white text-left p-4 md:text-right pt-32 md:pt-[360px] md:h-[560px] lg:h-[650px] xl:h-screen bg-bottom bg-contain bg-no-repeat duration-300 relative"
          >
            {/* <div className="absolute w-[300px] h-[220px]  bg-[#80B156]/30 blur-3xl md:w-[860px] md:h-[320px] md:ml-auto md:right-0 rounded-[10%]"></div>
            <div className="relative md:-mr-4 md:pr-12 md:py-10 xl:w-[920px] md:ml-auto">
              <h1 className="font-bold md:font-extrabold text-6xl md:text-8xl text-white">
                Kuliah Kerja Nyata
              </h1>
              <h3 className="font-medium text-white flex flex-col text-base md:text-3xl leading-4 md:leading-9 mt-4 md:mt-9 pb-12 md:pb-4">
                <span className="font-bold md:text-4xl">
                  Assalamu&apos;alaikum
                </span>
                <span>
                  Selamat Datang di Situs Resmi Kuliah Kerja Nyata (KKN)
                </span>
                <span>Universitas Islam Negeri Sunan Gunung Djati Bandung</span>
              </h3>
            </div> */}
          </div>
        </section>

        {/* Tengah */}
        <section className="py-6 md:py-16 px-4">
          <div className="flex flex-row flex-wrap justify-center items-center text-justify md:space-x-7">
            <div className="bg-[url('/images/what.jpg')] w-[240px] md:w-1/3 h-[240px] md:h-[420px] bg-cover bg-center rounded-lg mb-3 md:mb-0"></div>
            <div className="w-screen md:w-[55%]">
              <div className="flex flex-row space-x-[2px] md:space-x-4 ml-1 md:ml-0">
                <div className="w-1 h-1 md:w-4 md:h-4 bg-[#0090D7] rounded-full"></div>
                <div className="w-1 h-1 md:w-4 md:h-4 bg-[#368FBB] rounded-full"></div>
                <div className="w-1 h-1 md:w-4 md:h-4 bg-[#43AFE6] rounded-full"></div>
                <div className="w-1 h-1 md:w-4 md:h-4 bg-[#2C7599] rounded-full"></div>
              </div>
              <div className="font-medium text-lg lg:text-2xl">
                <h2 className="font-bold text-3xl mb-3 lg:mb-7 lg:text-6xl md:mt-2">
                  Apa itu KKN?
                </h2>
                <p>
                  KKN merupakan kepanjangan dari Kuliah Kerja Nyata. Ini
                  merupakan program mahasiswa untuk mengabdi kepada masyarakat
                  dengan pendekatan lintas keilmuan dan sektoral dalam kurun
                  waktu tertentu. Biasanya KKN dilakukan selama 1 atau 2 bulan
                  di sebuah desa atau wilayah setingkat desa.
                </p>
                <br></br>
                <p>
                  Program ini dilakukan oleh mahasiswa semester akhir seperti
                  semester 5 atau 6. Mereka akan menjalankan kegiatan belajar,
                  mengabdi, mengajar, dan berbaur dengan masyarakat dimana
                  mereka melakukan KKN. Untuk panduan KKN bisa lihat pada{"  "}
                  <Link href="/" className="underline hover:text-blue-700">
                    halaman berikut
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bawah */}
        <section className="mt-0 bg-gray-50 py-5 mb-4 md:mb-0">
          <div className="text-left px-2 lg:px-12 lg:py-10">
            <div className="flex flex-row space-x-[2px] md:space-x-4 ml-1 md:ml-6">
              <div className="w-1 h-1 md:w-4 md:h-4 bg-[#0090D7] rounded-full"></div>
              <div className="w-1 h-1 md:w-4 md:h-4 bg-[#368FBB] rounded-full"></div>
              <div className="w-1 h-1 md:w-4 md:h-4 bg-[#43AFE6] rounded-full"></div>
              <div className="w-1 h-1 md:w-4 md:h-4 bg-[#2C7599] rounded-full"></div>
            </div>
            <h1 className="font-bold text-3xl ml-1 -mt-1 md:mt-5 md:ml-9 lg:text-6xl">
              Sebaran Lokasi
            </h1>
          </div>
          <div className="px-5 mt-3 md:mb-10 md:mt-1 flex flex-col md:flex-row justify-center md:space-x-10">
            <div className="md:w-1/3 font-medium text-lg lg:text-2xl text-justify">
              <p className="mb-3">
                Kuliah Kerja Nyata (KKN) Universitas Islam Negeri Sunan Gunung
                Djati Bandung terbagi dalam beberapa sebaran lokasi, baik
                nasional maupun internasional. Terdapat 8 Jenis KKN pada tahun
                2024 yang disediakan oleh LP2M.
              </p>

              <Link
                href={"/sebaran"}
                className="w-44 font-medium text-xl text-inputColor py-2 rounded-md flex items-end space-x-3 hover:px-4 hover:bg-inputColor hover:text-white ease-in-out duration-100"
              >
                <h2>Selengkapnya</h2>
                <ChevronRightIcon className="h-6" />
              </Link>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 bg-inputHoverColor p-1 rounded-md">
              <Map />
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-5 text-base lg:text-lg font-medium">
        <div className="h-[720px] md:h-[450px] xl:h-[400px]">
          <div className="absolute -z-10 bg-fixed bg-cover bg-top w-full h-[720px] md:h-[450px] xl:h-[400px] bg-[url(/images/Kampus2Depan.jpeg)]"></div>
          <div className="bg-primaryColor bg-opacity-90 h-full flex flex-row flex-wrap px-6 py-10 space-y-6 lg:space-y-0 xl:space-y-4 lg:px-20 xl:px-32 xl:py-16 justify-between">
            <div className="1/5 lg:w-1/4 flex justify-center mr-0">
              <picture>
                <img
                  src="https://uinsgd.ac.id/wp-content/uploads/2019/12/Logo-UIN-Putih.png"
                  alt="Logo Uin Bandung"
                  className="w-24 lg:w-40 "
                />
              </picture>
            </div>
            <div className="1/3 lg:w-1/4 text-white">
              <h1 className="font-bold text-lg lg:text-2xl">MEDIA SOSIAL</h1>
              <p className="text-base lg:text-lg">
                Ikuti sosial media kami untuk medapatkan informasi terbaru
              </p>
              <div className="flex flex-row space-x-1 md:space-x-0 items-center py-1">
                {icons.map((icon, index) => (
                  <Link key={index} href={icon.href} target="blank">
                    <icon.icon className="w-7 h-7 lg:w-10 lg:h-10 text-white mr-3 hover:text-iconHoverColor" />
                  </Link>
                ))}
              </div>
              <div className="px-1 py-4 mt-1">
                <div>
                  <Link
                    className="flex items-start space-x-2"
                    href={"mailto:lp2m@uinsgd.ac.id"}
                  >
                    <IoMailOutline className="w-6 h-6 lg:w-9 lg:h-9" />
                    <span className="lg:text-2xl font-bold">
                      lp2m@uinsgd.ac.id
                    </span>
                  </Link>
                  <Link
                    className="flex items-start space-x-3 mt-2 ml-1"
                    href={"tel:+0227800525"}
                  >
                    <FaPhone className="w-5 h-5 lg:w-7 lg:h-7" />
                    <span className="lg:text-2xl font-bold">0227800525</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/2 lg:pl-10 space-y-2 xl:space-y-4 text-white">
              {kampuss.map((kampus, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div>
                    <IoLocation className="w-5 h-5 lg:w-7 lg:h-7" />
                  </div>
                  <div>
                    <h1 className="font-bold text-base lg:text-xl">
                      {kampus.kampus}
                    </h1>
                    <p className="text-sm lg:text-base">{kampus.jalan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Copyright />
      </footer>
    </>
  );
}
