// pages/api/auth/login.js

import { signIn } from 'next-auth/react';

export default async (req, res) => {
  try {
    // Attempt to sign in using credentials
    const result = await signIn('credentials', {
      username: req.body.username,
      password: req.body.password
    });

    // If signIn is successful, return a success response
    if (result?.error) {
      // Check if there's an error in the result
      console.error('Error during sign-in:', result.error);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    return res.status(200).end();
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
