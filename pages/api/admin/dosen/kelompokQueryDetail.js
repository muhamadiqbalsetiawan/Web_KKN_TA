import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [result] = await condb
      .promise()
      .query(
        ` SELECT
            d.nip,
            d.nama AS dosen_name,
            d.telpon_dosen,            
            GROUP_CONCAT(k.id) AS kelompok_ids,
            GROUP_CONCAT(DISTINCT k.jenis_kelompok) AS jenis_kelompok,
            GROUP_CONCAT(DISTINCT l.provinsi) AS lokasi_provinsi
        FROM
            dosen d
        JOIN
            kelompok k ON d.nip = k.id_dosen
        LEFT JOIN
            lokasi l ON k.id_lokasi = l.id
        WHERE
            d.nip = ?
        GROUP BY
            d.nip, d.nama, d.telpon_dosen;    
      `,
        [id]
      );

    if (result.length === 0) {
      res.status(404).json({ error: 'Group not found' });
    } else {
      res.status(200).json(result); // Return the entire result array
    }
  } catch (error) {
    console.error('Error fetching group details from MySQL:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
