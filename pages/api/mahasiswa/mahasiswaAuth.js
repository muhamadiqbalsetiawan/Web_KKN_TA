// mahasiswaAuth.js
import condb from "../../../lib/connectDatabase";

async function authenticateMahasiswa(username, password) {
  const [mahasiswaRows] = await condb.promise().query(
    'SELECT * FROM mahasiswa WHERE username = ? AND password = ?',
    [username, password]
  );

  if (mahasiswaRows.length > 0) {
    const mahasiswa = mahasiswaRows[0];
    // Store roles in the user session
    const user = { ...mahasiswa, roles: mahasiswa.roles };
    return user;
  } else {
    return null;
  }
}

module.exports = authenticateMahasiswa;
