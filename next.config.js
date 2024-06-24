/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    DB_SERVER: process.env.DB_SERVER,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
    TOKEN: process.env.TOKEN,
    TOKEN_SKS: process.env.TOKEN_SKS,
    TOKEN_SIP: process.env.TOKEN_SIP,
    URL: process.env.URL,
  },
};

module.exports = nextConfig;
