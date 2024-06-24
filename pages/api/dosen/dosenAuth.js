// dosenAuth.js
import condb from "../../../lib/connectDatabase";

async function authenticateDosen(nik, password) {
  const [dosenRows] = await condb.promise().query(
    'SELECT * FROM dosen WHERE nik = ? AND password = ?',
    [nik, password]
  );

  return dosenRows.length > 0 ? dosenRows[0] : null;
}

module.exports = authenticateDosen;