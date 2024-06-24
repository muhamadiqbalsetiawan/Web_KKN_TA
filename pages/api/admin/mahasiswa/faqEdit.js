import condb from "@/lib/connectDatabase";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { faq_id, pertanyaan, jawaban } = req.body;

    // Validate input
    if (!faq_id || !pertanyaan || !jawaban) {
      console.error("Validation Error: FAQ ID, Pertanyaan, and Jawaban fields are required.");
      return res.status(400).json({ success: false, message: "FAQ ID, Pertanyaan, and Jawaban fields are required." });
    }

    try {
      // Update the FAQ entry in the database
      const [result] = await condb
        .promise()
        .query("UPDATE faq SET pertanyaan = ?, jawaban = ? WHERE faq_id = ?", [
          pertanyaan,
          jawaban,
          faq_id
        ]);

      if (result.affectedRows === 0) {
        console.log("FAQ not found for ID:", faq_id);
        return res.status(404).json({ success: false, message: "FAQ not found." });
      }

      console.log("FAQ updated successfully for ID:", faq_id);
      res.status(200).json({ success: true, message: "FAQ updated successfully." });
    } catch (error) {
      console.error("Error updating FAQ in MySQL:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else {
    console.error("Method Not Allowed: Only PUT requests are allowed.");
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
