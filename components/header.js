import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

export default function Header() {
  const [mobileNav, setMobileNav] = useState(false);
  const [navbarBackground, setNavBackground] = useState(false);

  const handleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setNavBackground(true);
      } else {
        setNavBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const router = useRouter();

  return (
    <header
      className={
        navbarBackground
          ? "fixed w-full z-50 bg-primaryColor shadow-md transition ease-in-out duration-700"
          : "fixed w-full z-50 bg-transparent shadow-none transition ease-in-out duration-300"
      }
    >
      <div
        className={
          navbarBackground
            ? "px-4 max-w-screen-xl mx-auto flex flex-row flex-wrap justify-between items-center md:max-w-3xl xl:max-w-7xl ease-in-out duration-500"
            : "px-4 max-w-screen-xl mx-auto flex flex-row flex-wrap justify-between items-center md:max-w-3xl xl:max-w-7xl md:translate-y-6 ease-in-out duration-500"
        }
      >
        <div
          className={`h-full py-1`}
        >
          <Link
            href="/"
            className={`flex items-center h-full py-2 space-x-2 md:space-x-4 px-4 ease-in-out duration-200`}
          >
            {navbarBackground ? (
              <picture>
                <img
                  src="https://uinsgd.ac.id/wp-content/uploads/2019/12/Logo-UIN-Putih.png"
                  alt="Logo UIN"
                  className="w-5 md:w-8"
                />
              </picture>
            ) : (
              <picture>
                <img
                  src="/nav-logo.png"
                  alt="Logo UIN"
                  className="w-5 md:w-8"
                />
              </picture>
            )}

            <span>
              <p
                className={`md:leading-3 text-[7px] md:text-[13px] font-semibold text-white`}
              >
                Lembaga Penelitian dan Pengabdian Kepada Masyarakat
              </p>
              <p
                className={`md:leading-5 text-[10px] md:text-lg font-extrabold text-white`}
              >
                UIN SUNAN GUNUNG DJATI BANDUNG
              </p>
            </span>
          </Link>
        </div>
        <div className="w-max flex items-center md:space-x-10 space-x-2 font-bold text-lg">
          <ul className="hidden md:flex flex-row md:space-x-4">
            <Link href={"/"}>
              <li
                className={
                  navbarBackground
                    ? `text-white hover:text-[#000] hover:border-b-2 hover:border-black px-2 py-3 transition ease-in-out duration-200 ${
                        router.pathname === "/"
                          ? "border-b-2 border-white"
                          : "border-b-0 border-white"
                      }`
                    : `hover:text-white hover:border-b-2 hover:border-white  px-2 py-3 transition ease-in-out duration-200 ${
                        router.pathname === "/"
                          ? "text-white border-b-2 border-white"
                          : "border-b-0 border-white"
                      }`
                }
              >
                Beranda
              </li>
            </Link>
            <Link href={"/sebaran"}>
              <li
                className={
                  navbarBackground
                    ? `text-white hover:text-[#000] hover:border-b-2 hover:border-black px-2 py-3 transition ease-in-out duration-200 ${
                        router.pathname === "/sebaran"
                          ? "border-b-2 border-white"
                          : "border-b-0 border-white"
                      }`
                    : `hover:text-[#fff] hover:border-b-2 hover:border-white px-2 py-3 transition ease-in-out duration-200 ${
                        router.pathname === "/sebaran"
                          ? "text-white border-b-2 border-white"
                          : "border-b-0 border-white"
                      }`
                }
              >
                Sebaran Lokasi
              </li>
            </Link>
          </ul>
          <Link
            href={"/login"}
            className={
              navbarBackground
                ? "text-black bg-white py-1 md:py-2 px-3 md:px-8 rounded-xl md:rounded-full hover:bg-[#e5e2e2] text-[10px] md:text-lg transition ease-in-out duration-200"
                : "text-white bg-inputColor py-1 md:py-2 px-3 md:px-8 rounded-xl md:rounded-full hover:bg-white hover:text-inputColor text-[10px] md:text-lg transition ease-in-out duration-200"
            }
          >
            Login
          </Link>
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={handleMobileNav}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <div
            className={
              mobileNav
                ? "fixed bg-primaryColor shadow-md right-0 top-0 w-screen h-screen ease-in-out duration-200 z-0"
                : "absolute top-0 w-screen h-screen -right-[5700px] ease-in-out duration-1000 z-0"
            }
          >
            <div className="text-right px-4 py-3">
              <button
                className="md:hidden p-2 cursor-pointer"
                onClick={handleMobileNav}
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="md:hidden">
              <h1 className="text-white font-extrabold tracking-wide text-4xl px-5 py-5 mb-5 border-b-2 border-white text-center">
                Menu
              </h1>
              <ul className="md:hidden space-y-6 text-center font-medium tracking-wide text-xl">
                <Link href={"/"}>
                  <li className="text-white text-lg hover:text-AbuIjo px-[40%] py-3 my-1 active:text-white focus:text-white transition ease-in-out duration-200">
                    Beranda
                  </li>
                </Link>
                <Link href={"/sebaran"}>
                  <li className="text-white text-lg hover:text-AbuIjo px-[35%] py-3 my-1 active:text-white focus:text-white transition ease-in-out duration-200">
                    Sebaran Lokasi
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
