import { signIn } from 'next-auth/react';

export async function login(credentials) {
  try {
    console.log('Login attempt with credentials:', credentials);

    const response = await fetch('https://api.uinsgd.ac.id/salam/v2/auth/mahasiswa/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      const data = await response.json();

      const user = {
        name: data.data[0].username,
        token: data.token, // Replace with the actual property containing the email
        // Add other user properties if needed
      };

      console.log('Successful login. User:', user);

      signIn('your-custom-provider-name', { user, token: data.data.token, callbackUrl: '/' });
    } else {
      // Handle login failure
      console.error('Login failed. Response:', response.status, response.statusText);
    }
  } catch (error) {
    // Log any errors that occur during the login process
    console.error('An error occurred during login:', error);
  }
}
