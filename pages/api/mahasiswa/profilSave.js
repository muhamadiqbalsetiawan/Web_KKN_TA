// pages/api/mahasiswa/profilSave.js
import condb from "@/lib/connectDatabase";
import { useSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    nim,
    nama,
    jk,
    nama_jur,
    fakultas,
    universitas,
    telepon_seluler,
    telepon_wali,
    foto,
  } = req.body;

  if (!nim) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    // Assuming "mahasiswa" is the table name in your database
    await condb
      .promise()
      .query(
        `INSERT INTO mahasiswa (nim, name, gender, jurusan, fakultas, universitas, telpon, telpon_wali, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nim, nama, jk, nama_jur, fakultas, universitas, telepon_seluler, telepon_wali, foto]
      );

    res.status(200).json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
