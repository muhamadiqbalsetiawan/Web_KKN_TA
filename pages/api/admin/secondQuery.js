import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [result] = await condb.promise().query(`
    SELECT
        l.id AS lokasi_id,
        l.negara AS lokasi_negara,
        l.provinsi AS lokasi_provinsi,
        l.kecamatan AS lokasi_kecamatan,
        l.kota AS lokasi_kota,
        l.kelurahan AS lokasi_kelurahan,
        COUNT(k.id) AS jumlah_kelompok
    FROM
        lokasi l
    JOIN
        kelompok k ON l.id = k.id_lokasi
    GROUP BY
        l.id, l.negara, l.provinsi, l.kecamatan, l.kota, l.kelurahan
    ORDER BY
        jumlah_kelompok DESC
    LIMIT 10;
    `);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data from MySQL:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
