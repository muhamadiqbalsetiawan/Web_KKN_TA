import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { nim, nilai } = req.body;

    try {
    //   console.log("Updating nilai in the database...");
    //   console.log("Request Body:", req.body);

      // Update the nilai in the database based on nim
      const [result] = await condb
        .promise()
        .query("UPDATE mahasiswa SET nilai = ? WHERE nim = ?", [nilai, nim]);

    //   console.log("Updated successfully:", result);
    //   console.log("NIM:", nim);

      res.status(200).json({ success: true, message: "Nilai updated successfully." });
    } catch (error) {
    //   console.error("Error updating nilai in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    // console.log("Method Not Allowed:", req.mesthod);
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
