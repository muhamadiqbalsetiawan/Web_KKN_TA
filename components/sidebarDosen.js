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

export default function SidebarDosen() {
  const dosenMenus = [
    {
      id: 1,
      link: "/dosen/dashboard",
      menu: "Dashboard",
      icon: dashboardIcon,
    },
    {
      id: 2,
      link: "/dosen/kelompok",
      menu: "Kelompok Binaan",
      icon: profilIcon,
    },
    {
      id: 3,
      link: "/dosen/logbook",
      menu: "Logbook",
      icon: faqIcon,
    },
    {
      id: 4,
      link: "/dosen/laporan",
      menu: "Laporan",
      icon: libIcon,
    },
    {
      id: 5,
      link: "/dosen/nilai",
      menu: "Nilai",
      icon: homeIcon,
    },
    {
      id: 6,
      link: "/dosen/ajuan",
      menu: "Ajuan Surat",
      icon: docIcon,
    },
  ];

  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(true);

  const handleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  return (
    <>
      <button
        className="lg:hidden absolute px-5 py-4 cursor-pointer z-40"
        onClick={handleMobileNav}
      >
        <Bars3Icon className="w-6 h-6 lg:text-black text-white" />
      </button>
      <div
        className={
          mobileNav ? "w-full h-full absolute z-40 lg:hidden" : "hidden"
        }
        onClick={handleMobileNav}
      ></div>
      <button
        className={
          mobileNav
            ? "absolute -left-16 top-36 hover:top-32 lg:left-52 z-50 lg:bg-white px-0 hover:px-1 hover:pl-2 py-3 hover:py-7 rounded-r-xl hover:rounded-r-lg ease-in-out duration-200"
            : "absolute -left-16 lg:fixed top-36 hover:top-32 lg:left-16 z-50 lg:bg-white py-3 px-0 rounded-r-2xl hover:px-1 hover:pl-3 hover:py-7 hover:rounded-r-lg ease-in-out duration-200"
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
            ? "fixed lg:relative z-50 lg:z-40 w-56 h-screen lg:h-auto bg-white rounded-e-xl shadow-lg text-sm py-2 lg:py-3 lg:mt-10 ease-in-out duration-200 left-0 lg:left-0 lg:overflow-visible overflow-y-scroll"
            : "fixed lg:relative z-50 lg:z-40 w-56 lg:w-20 h-screen lg:h-auto bg-white rounded-e-xl shadow-lg text-sm py-2 lg:py-3 lg:mt-10 -left-96 ease-in-out duration-200 lg:left-0"
        }
      >
        <div className="px-3">
          <button
            className="lg:hidden p-2 cursor-pointer"
            onClick={handleMobileNav}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div
          className={
            mobileNav
              ? "px-2 py-3 lg:px-8 lg:py-6 text-center cursor-pointer"
              : "px-2 py-3 lg:px-2 lg:py-5 text-center cursor-pointer"
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
              Pembimbing
            </h1>
          </div>
        </div>
        <ul>
          {dosenMenus.map((menus, i) => (
            <Link key={i} id={menus.id} href={menus.link}>
              <li
                className={`px-8 py-3 my-1 hover:font-bold hover:bg-gray-100 flex flex-row items-center ${
                  router.pathname === menus.link ? "bg-gray-100 font-bold" : ""
                }`}
              >
                <menus.icon
                  className={
                    mobileNav
                      ? "w-4 h-4 mr-2 ease-in-out duration-200"
                      : "block w-6 h-6 mr-0 ease-in-out duration-200"
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

        <div className="text-center mt-10 px-2">
          <h3>&copy; Made with KKN 2024</h3>
        </div>
      </div>
    </>
  );
}
