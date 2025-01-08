// // components/get-ip.js

// import { headers } from "next/headers";
// import { rateLimit } from "@/lib/rateLimit"; // Pastikan path ini benar sesuai dengan lokasi fungsi rateLimit Anda

// export default function checkRateLimit() {
//   // Dapatkan IP dari headers
//   const ip = headers().get("x-forwarded-for") || "unknown"; // Jika IP tidak tersedia, gunakan 'unknown'

//   // Periksa apakah pengguna telah mencapai limit
//   const isRateLimited = rateLimit(ip);

//   if (isRateLimited) {
//     console.log("User rate limited:", ip);
//     return true; // Mengembalikan true jika pengguna terkena rate limit
//   }

//   console.log("User allowed:", ip);
//   return false; // Mengembalikan false jika pengguna diizinkan
// }

// pages/api/rate-limit.js
import { rateLimit } from "@/lib/rateLimit";

export default function handler(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const isRateLimited = rateLimit(ip);
  
  if (isRateLimited) {
    return res.status(429).json({ error: "Terlalu banyak permintaan. Silakan coba lagi nanti." });
  }

  res.status(200).json({ message: "OK" });
}
