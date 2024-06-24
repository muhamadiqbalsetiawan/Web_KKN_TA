import dashboardIcon from "@/components/svgs/dashboard";
import docIcon from "@/components/svgs/doc";
import faqIcon from "@/components/svgs/faq";
import homeIcon from "@/components/svgs/home";
import libIcon from "@/components/svgs/lib";
import profilIcon from "@/components/svgs/profil";

export const afterDaftar = [
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

export const beforeDaftarNon = [
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
    link: "/mahasiswa/frequentlyAQ",
    menu: "FAQ",
    icon: faqIcon,
  },
];

export const beforeDaftarReguler = [
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
    link: "/mahasiswa/frequentlyAQ",
    menu: "FAQ",
    icon: faqIcon,
  },
];

