import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import condb from "../../../lib/connectDatabase";
import authenticateDosen from "../dosen/dosenAuth";
import authenticateMahasiswa from "../mahasiswa/mahasiswaAuth";

export default NextAuth({
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // For Admin and SuperAdmin
        username: { label: "username", type: "text" },
        // For Mahasiswa
        nim: { label: "NIM", type: "text" },
        // For Dosen
        nik: { label: "NIK", type: "text" },
        password: { label: "Password", type: "password" },

      },
      authorize: async (credentials) => {
        const { username, nim, nik, password } = credentials;

        try { 

          // Check if it's a Mahasiswa login
          if (username && password) {
            const user = await authenticateMahasiswa(username, password);
            if (user){
              console.log("Authorized user:", user);
              return Promise.resolve(user);
            }
            
            // const mahasiswa = await authenticateMahasiswa(username, password);
            // if (mahasiswa) {
            //   // Add roles to the session for Mahasiswa
            //   return Promise.resolve({ ...mahasiswa, roles: mahasiswa.roles });
            // }            
            //return authenticateMahasiswa(username, password);
          }

          // Check if it's a Dosen login
          if (nik && password) {
            return authenticateDosen(nik, password);
          }

          // Return null if no valid user is found
          console.log("No valid user found");
          return null;
        } catch (error) {
          console.error('Database query error:', error);
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) token.role = user.role;
      return token;
    },
    session: ({ session, token }) => {
      session.user.role      = token.role;
      session.user.roles = [token.role];
      return session;
    },
  }
});