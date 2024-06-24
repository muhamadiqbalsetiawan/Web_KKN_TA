import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [result] = await condb.promise().query(`
      SELECT
        kelompok.id,
        kelompok.name,
        lokasi.kelurahan,
        lokasi.kecamatan,
        lokasi.kota,
        lokasi.provinsi,
        dosen.nama
      FROM
        kelompok
      JOIN
        lokasi ON kelompok.id_lokasi = lokasi.id
      JOIN
        dosen ON kelompok.id_dosen = dosen.nip
    `);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data from MySQL:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
