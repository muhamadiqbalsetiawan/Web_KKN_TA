import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // console.log("credentials", credentials);
        const authResponse = await fetch("https://api.uinsgd.ac.id/salam/v2/auth/mahasiswa/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();
        console.log("user", user);

        // Return an object with the username property
        return { ...user, username: credentials.username };
        // return (result);

        // Access the array inside data and return it directly
        // const dataArray = user.data.data;
        // console.log("dataArray", dataArray);
        // return {user, dataArray};
      },
      
    }),
  ],
  callbacks: {
    session({ session, token }) {
      // Set user properties in the session
      session.user.token = token.id;
      session.user.username = token.username;
      session.user.image = token.image;
      session.user.role = token.role;

      return session;
    },
    jwt({ token, account, user }) {
      // Set token properties
      if (account) {
        token.id = user.data.token;
        token.username = user.username;
        token.image = user.data.data[0].foto_user_new;
        if(user.username.length === 10){
          token.role = "mahasiswa";
        }
        if(user.username.length === 18){
          token.role = "dosen";
        }
        if(user.username.length === 12){
          token.role = "superadmin";
        }
        if (user.username.slice(0, 5).toLowerCase() === "admin") {
          token.role = "admin";
        }
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
  jwt: {
    secret: process.env.JWT_SECRET,
  }
  
});
