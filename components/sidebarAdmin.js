import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaBars, FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";

export default function SidebarAdmin() {
  const router = useRouter();

  const adminMenus = [
    {
      id: 1,
      menu: " Dashboard ",
      link: "/admin/dashboard",
    },
    {
      id: 2,
      menu: " Mahasiswa",
      link: "/",
      submenu: [
        {
          id: 1,
          menu: " Identitas mahasiswa ",
          link: "/admin/mahasiswa/identitas",
        },
        {
          id: 7,
          menu: " Status Pendaftar KKN ",
          link: "/admin/mahasiswa/statuskkn",
        },
        {
          id: 2,
          menu: " Kelompok KKN ",
          link: "/admin/mahasiswa/kelompok",
        },
        {
          id: 3,
          menu: " Logbook",
          link: "/admin/mahasiswa/logbook",
        },
        {
          id: 4,
          menu: " Laporan",
          link: "/admin/mahasiswa/laporan",
        },
        {
          id: 5,
          menu: " Nilai ",
          link: "/admin/mahasiswa/nilai",
        },
        {
          id: 6,
          menu: " FAQ ",
          link: "/admin/mahasiswa/faq",
        },
      ],
    },
    {
      id: 3,
      menu: " Dosen Pembimbing ",
      link: "/",
      submenu: [
        {
          id: 1,
          menu: " Identitas Dosen ",
          link: "/admin/dosen/identitas",
        },
        {
          id: 2,
          menu: " Kelompok ",
          link: "/admin/dosen/kelompok",
        },
        {
          id: 3,
          menu: " Laporan ",
          link: "/admin/dosen/laporan",
        },
        {
          id: 4,
          menu: " Nilai ",
          link: "/admin/dosen/nilai",
        },
        {
          id: 5,
          menu: " Ajuan Surat ",
          link: "/admin/dosen/ajuan",
        },
      ],
    },
    {
      id: 4,
      menu: "Settings",
      link: "",
      submenu: [
        {
          id: 1,
          menu: " Kelompok ",
          link: "/admin/settings/kelompok",
        },
        {
          id: 2,
          menu: " Lokasi ",
          link: "/admin/settings/lokasi",
        },
        {
          id: 3,
          menu: " DPL ",
          link: "/admin/settings/dpl",
        },
        {
          id: 4,
          menu: " Pengguna ",
          link: "/admin/settings/pengguna",
        },
        {
          id: 5,
          menu: " Pembukaan ",
          link: "/admin/settings/pembukaan",
        },
        {
          id: 6,
          menu: " Akun Mahasiswa Luar ",
          link: "/admin/settings/mahasiswaLuar",
        },
      ],
    },
    {
      id: 5,
      menu: "Logout ",
      link: "/admin",
    },
  ];

  const [activeMenu, setActiveMenu] = useState(null);
  const handleMenu = (idmenu) => {
    setActiveMenu(idmenu);
  };

  return (
    <>
      <div className="md:h-auto w-56 bg-white rounded-e-xl shadow-md text-sm py-6 fixed z-50 mt-14">
        <div className="px-8 py-6 text-center">
          <picture>
            <img
              src="/nav-logo2.png"
              alt="Logo Uin"
              className="w-20 h-20 m-auto"
            />
          </picture>
          <div className="pt-5 px-2">
            <h1 className="font-black text-lg leading-3">KKN UIN</h1>
            <h1 className="font-bold text-base italic">Admin</h1>
          </div>
        </div>
        <ul>
          {adminMenus.map((menu) => (
            <React.Fragment key={menu.id}>
              {/* Menu with no submenu */}
              {!menu.submenu && (
                <li>
                  <Link href={menu.link}>
                    <p
                      className={`flex items-center justify-start px-4 py-2 hover:bg-gray-100 cursor-pointer
                    ${
                      router.pathname === menu.link
                        ? "bg-gray-100"
                        : "bg-transparent"
                    }`}
                    >
                      {/* Menu Text */}
                      <span>{menu.menu}</span>
                    </p>
                  </Link>
                </li>
              )}

              {/* Menu with submenu */}
              {menu.submenu && (
                <li>
                  <div
                    className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer
                    ${
                      activeMenu === menu.id ||
                      menu.submenu?.some((sub) => sub.link === router.pathname)
                        ? "bg-gray-100"
                        : "bg-transparent"
                    }`}
                    onClick={() =>
                      // setActiveMenu(activeMenu === menu.id ? null : menu.id)
                      handleMenu(activeMenu === menu.id ? null : menu.id)
                    }
                  >
                    {/* Text */}
                    <span>{menu.menu}</span>
                    {/* Chevron Icon */}
                    {activeMenu === menu.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {/* Submenu */}
                  {activeMenu === menu.id && (
                    <ul className="ml-4">
                      {menu.submenu.map((sub) => (
                        <li key={sub.id}>
                          <Link href={sub.link}>
                            <p
                              className={`flex items-center justify-start px-4 py-2 hover:bg-gray-100 cursor-pointer
                            ${
                              router.pathname === sub.link
                                ? "bg-gray-100"
                                : "bg-transparent"
                            }
                            `}
                            >
                              {/* Submenu Text */}
                              <span>{sub.menu}</span>
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>

        <div className="text-center mt-10 px-2">
          <h3>&copy; Made with KKN 2024</h3>
        </div>
      </div>
    </>
  );
}
