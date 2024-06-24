import React from 'react';
import db from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export default async (req, res) => {
  if (req.method === 'DELETE') {
    const { dsn_id } = req.body;

    // Validate input
    if (!dsn_id) {
      return res.status(400).json({ error: 'ID Dosen harus diisi' });
    }

    try {
      // Get file_patch from the database
      const selectSql = 'SELECT file_patch FROM dsn WHERE dsn_id = ?';
      const [result] = await db.promise().query(selectSql, [dsn_id]);

      if (result.length > 0) {
        const filePatch = result[0].file_patch;

        // Log path file yang akan dihapus
        console.log('File Path to be deleted:', filePatch);

        // Delete file from the system if filePatch exists
        if (filePatch) {
          const filePath = path.join(process.cwd(), 'public', 'uploads', 'pdf', filePatch);
          // Log path lengkap ke file yang akan dihapus
          console.log('Full File Path to be deleted:', filePath);

          // Pastikan file ada sebelum dihapus
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('File deleted successfully.');
          } else {
            console.error('File not found:', filePath);
          }
        }

        // Update file_patch to NULL in the database
        const updateSql = 'UPDATE dsn SET file_patch = NULL WHERE dsn_id = ?';
        await db.promise().query(updateSql, [dsn_id]);

        return res.status(200).json({ message: 'File berhasil dihapus' });
      } else {
        return res.status(404).json({ error: 'Data tidak ditemukan' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Gagal menghapus file', details: error.message });
    }
  } else {
    return res.status(405).end();
  }
};
