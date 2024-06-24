import Link from "next/link";
import React, { useState } from "react";
import dashboardIcon from "./svgs/dashboard";
import docIcon from "./svgs/doc";
import profilIcon from "./svgs/profil";
import homeIcon from "./svgs/home";
import libIcon from "./svgs/lib";
import faqIcon from "./svgs/faq";
import { useRouter } from "next/router";
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function SidebarMahasiswa() {
  const mahasiswaMenus = [
    {
      id: 1,
      link: "/mahasiswa/dashboard",
      menu: "Dashboard",
      icon: dashboardIcon,
    },
    {
      id: 2,
      link: "/mahasiswa/pendaftaran",
      menu: "Pendaftaran",
      icon: docIcon,
    },
    {
      id: 3,
      link: "/mahasiswa/kelompok",
      menu: "Kelompok",
      icon: profilIcon,
    },
    {
      id: 4,
      link: "/mahasiswa/logbook",
      menu: "Logbook",
      icon: homeIcon,
    },
    {
      id: 5,
      link: "/mahasiswa/laporan",
      menu: "Laporan KKN",
      icon: libIcon,
    },
    {
      id: 6,
      link: "/mahasiswa/frequentlyAQ",
      menu: "FAQ",
      icon: faqIcon,
    },
  ];

  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);

  const handleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  return (
    <>
      <button
        className="md:hidden absolute px-5 py-4 cursor-pointer z-30"
        onClick={handleMobileNav}
      >
        <Bars3Icon className="w-6 h-6" />
      </button>
      <div
        className={
          mobileNav ? "w-full h-full absolute z-40 md:hidden" : "hidden"
        }
        onClick={handleMobileNav}
      ></div>
      <button
        className={
          mobileNav
            ? "absolute -left-16 md:fixed top-32 md:left-52 z-50 md:bg-iceGray px-1 py-7 rounded-r-md ease-in-out duration-200"
            : "absolute -left-16 md:fixed top-36 hover:top-32 md:left-16 z-50 md:bg-iceGray py-3 px-0 rounded-r-2xl hover:px-1 hover:pl-4 hover:py-7 hover:rounded-r-md ease-in-out duration-200"
        }
        onClick={handleMobileNav}
      >
        {mobileNav ? (
          <ChevronLeftIcon className="w-6 h-6" />
        ) : (
          <ChevronRightIcon className="w-6 h-6" />
        )}
      </button>
      <div
        className={
          mobileNav
            ? "absolute md:fixed z-40 w-56 h-screen md:h-[540px] xl:h-[600px] bg-iceGray rounded-e-xl shadow-lg text-sm py-7 md:py-3 md:mt-10 ease-in-out duration-200 left-0 md:left-0"
            : "absolute md:fixed z-40 w-56 md:w-20 h-screen md:h-[540px] xl:h-[600px] bg-iceGray rounded-e-xl shadow-lg text-sm py-7 md:py-3 md:mt-10 -left-96 ease-in-out duration-200 md:left-0"
        }
      >
        <div className="px-3">
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={handleMobileNav}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div
          className={
            mobileNav
              ? "px-8 py-6 text-center cursor-pointer"
              : "px-2 py-5 text-center cursor-pointer"
          }
          onClick={handleMobileNav}
        >
          <picture>
            <img
              src="/nav-logo2.png"
              alt="Logo Uin"
              className={
                mobileNav
                  ? "w-20 h-20 m-auto ease-in-out duration-200"
                  : "w-12 h-12 m-auto ease-in-out duration-200"
              }
            />
          </picture>
          <div className="pt-5 px-2">
            <h1
              className={
                mobileNav
                  ? "font-black text-lg leading-3"
                  : "font-black text-base leading-3"
              }
            >
              KKN UIN
            </h1>
            <h1
              className={
                mobileNav
                  ? "font-bold text-base italic"
                  : "font-bold text-[10px] italic"
              }
            >
              Mahasiswa
            </h1>
          </div>
        </div>
        <ul>
          {mahasiswaMenus.map((menus, i) => (
            <Link key={i} id={menus.id} href={menus.link}>
              <li
                className={`px-8 py-3 my-1 hover:font-bold hover:bg-hoverGray flex flex-row items-center ${
                  router.pathname === menus.link ? "bg-hoverGray font-bold" : ""
                }`}
              >
                <menus.icon
                  className={
                    mobileNav
                      ? "w-4 h-4 mr-2 ease-in-out duration-200"
                      : "w-6 h-6 mr-0 ease-in-out duration-200"
                  }
                />
                <span
                  className={
                    mobileNav
                      ? "text-base ease-in-out duration-200"
                      : "text-[0px] ease-in-out duration-200"
                  }
                >
                  {menus.menu}
                </span>
              </li>
            </Link>
          ))}
        </ul>

        <div className="w-full text-center mt-10 px-2">
          <h3>&copy; Made with KKN 2024</h3>
        </div>
      </div>
    </>
  );
}
