// pages/api/auth/logout.js

import { signOut } from 'next-auth/react';

export default async (req, res) => {
  await signOut();
  return res.status(200).end();
}
