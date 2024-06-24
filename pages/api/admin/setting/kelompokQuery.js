// import condb from "../../../../lib/connectDatabase";

// export default async function handler(req, res) {
//   try {
//     const [dataRows] = await condb.promise().query(`
//       SELECT
//         k.*,
//         d.nip AS dosen_nip,
//         l.id AS lokasi_id,
//         m.nim AS mahasiswa_nim,
//         d.nama AS dosen_nama,
//         l.kelurahan AS lokasi_kelurahan,
//         l.kecamatan AS lokasi_kecamatan,
//         l.kota AS lokasi_kota,
//         l.provinsi AS lokasi_provinsi,
//         k.l AS batas_laki,
//         k.p AS batas_perempuan,
//         m.name AS ketua_nama
//       FROM
//         kelompok k
//       LEFT JOIN dosen d ON k.id_dosen = d.nip
//       LEFT JOIN lokasi l ON k.id_lokasi = l.id
//       LEFT JOIN mahasiswa m ON k.id_ketua = m.nim
//     `);

//     const data = dataRows.map(row => ({
//       id: row.id,
//       nip: row.nip,
//       name: row.name,
//       jenis_kelompok: row.jenis_kelompok,
//       jurusan_dosen: row.jurusan_dosen,
//       fakultas_dosen: row.fakultas_dosen,
//       telpon_dosen: row.telpon_dosen,
//       dosen_nip: row.dosen_nip,
//       lokasi_id: row.lokasi_id,
//       mahasiswa_nim: row.mahasiswa_nim,
//       dosen_nama: row.dosen_nama,
//       lokasi_kelurahan: row.lokasi_kelurahan,
//       lokasi_kecamatan: row.lokasi_kecamatan,
//       lokasi_kota: row.lokasi_kota,
//       lokasi_provinsi: row.lokasi_provinsi,
//       ketua_nama: row.ketua_nama,
//     }));

//     res.status(200).json(data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

import condb from "../../../../lib/connectDatabase";

export default async function handler(req, res) {
  try {
    const [dataRows] = await condb.promise().query(`
      SELECT
        k.*,
        d.nip AS dosen_nip,
        l.id AS lokasi_id,
        m.nim AS mahasiswa_nim,
        d.nama AS dosen_nama,
        l.kelurahan AS lokasi_kelurahan,
        l.kecamatan AS lokasi_kecamatan,
        l.kota AS lokasi_kota,
        l.provinsi AS lokasi_provinsi,
        m.name AS ketua_nama,
        k.jenis_kelompok AS jenis
      FROM
        kelompok k
      LEFT JOIN dosen d ON k.id_dosen = d.nip
      LEFT JOIN lokasi l ON k.id_lokasi = l.id
      LEFT JOIN mahasiswa m ON k.id_ketua = m.nim
      LEFT JOIN jenis_kkn ON k.jenis_kelompok = jenis_kkn.jenis_kelompok
    `);

    const data = dataRows.map(row => ({
      id: row.id,
      nip: row.nip,
      name: row.name,
      batas_laki: row.l,
      batas_perempuan: row.p,
      jenis_kelompok: row.jenis_kelompok,
      jurusan_dosen: row.jurusan_dosen,
      fakultas_dosen: row.fakultas_dosen,
      telpon_dosen: row.telpon_dosen,
      dosen_nip: row.dosen_nip,
      lokasi_id: row.lokasi_id,
      mahasiswa_nim: row.mahasiswa_nim,
      dosen_nama: row.dosen_nama,
      lokasi_kelurahan: row.lokasi_kelurahan,
      lokasi_kecamatan: row.lokasi_kecamatan,
      lokasi_kota: row.lokasi_kota,
      lokasi_provinsi: row.lokasi_provinsi,
      ketua_nama: row.ketua_nama,
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
