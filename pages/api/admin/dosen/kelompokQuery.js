import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [result] = await condb.promise().query(`
    SELECT
        d.nip,
        d.nama AS dosen_name,
        d.jurusan_dosen,
        d.fakultas_dosen,
        d.telpon_dosen,
        GROUP_CONCAT(DISTINCT k.jenis_kelompok) AS jenis_kelompok,
        GROUP_CONCAT(k.name) AS kelompok_ids,
        l.provinsi
    FROM
        dosen d
    LEFT JOIN
        kelompok k ON d.nip = k.id_dosen
    LEFT JOIN
        lokasi l ON k.id_lokasi = l.id
    GROUP BY
        d.nip, d.nama, d.jurusan_dosen, d.fakultas_dosen, d.telpon_dosen, l.provinsi
    ORDER BY
    CAST(SUBSTRING_INDEX(k.name, ' ', -1) AS UNSIGNED) ASC;
    `);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data from MySQL:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
