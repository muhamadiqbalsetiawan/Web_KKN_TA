import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: {  label: "Password",  type: "password" },
        token: {  label: "Token",  type: "text" }, // Add a new field for token
      },
      async authorize(credentials) {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);
        formData.append('token', credentials.token);

        // Determine which API to use based on the presence of the 'token' field
        const apiUrl = credentials.token
          ? "https://sip.uinsgd.ac.id/sip_module/ws/login"  // New API
          : "https://api.uinsgd.ac.id/salam/v2/auth/mahasiswa/login";  // Default API

        // Prepare the request body
        const body = credentials.token
          ? { ...credentials, token: process.env.TOKEN_SIP }  // Include the SIP token
          : credentials;

        // Make the authentication request
        const authResponse = credentials.token ? await fetch('https://sip.uinsgd.ac.id/sip_module/ws/login', {
          method: 'POST',
          body: formData,
        }) : await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();
        console.log("user", user);

        // Return an object with the necessary user properties
        return { ...user, username: credentials.username };
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if(token.username.length === 18) {
        // Set user properties in the session
        session.user.nama = token.nama;
        session.user.username = token.username;
        session.user.image = token.image;
        session.user.role = token.role;
        session.user.jurusan = token.jurusan;
        session.user.fakultas = token.fakultas;
        session.user.gender = token.gender;
  
        return session;
        }
      if(token.username.length === 10) {
      // Set user properties in the session
      session.user.token = token.id;
      session.user.username = token.username;
      session.user.image = token.image;
      session.user.role = token.role;

      return session;
      }
      
    },
    jwt({ token, account, user }) {
      // Set token properties
      if (account && user.username.length === 18) {
        token.nama = user.nama;
        token.username = user.nip;
        token.image = user.foto;
        // token.jurusan = user.profil[0].nama_unit;
        // token.fakultas = user.profil[0].satuan;
        // token.gender = user.profil[0].kelamin;
      }
      if (account && user.username.length === 10) {
        token.id = user.data.token;
        token.username = user.username;
        token.image = user.data.data[0].foto_user_new;
      }
        // Add role based on username length and 'admin' prefix
        if (user.username.length === 10) {
          token.role = "mahasiswa";
        } else if (user.username.length === 18) {
          token.role = "dosen";
        } else if (user.username.length === 12) {
          token.role = "superadmin";
        } else if (user.username.slice(0, 5).toLowerCase() === "admin") {
          token.role = "admin";
        }
      

      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
});
