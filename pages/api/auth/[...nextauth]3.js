import condb from "@/lib/connectDatabase";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

async function findUserInDatabase(credentials, res) {
  return new Promise((resolve, reject) => {
    condb.query(
      "SELECT * FROM akun_mahasiswa_luar WHERE username = ? AND password = ?",
      [credentials.username, credentials.password],
      (err, results) => {
        if (err) {
          console.error("Error finding user in database:", err);
          return reject(err);
        }

        if (results.length > 0) {
          return resolve(results[0]);
        } else {
          return resolve(null);
        }
      }
    );
  });
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const userInDatabase = await findUserInDatabase(credentials);

          console.log(userInDatabase);

          if (userInDatabase) {
            console.log("Login successful");
            return userInDatabase;
          } else {
            const authResponse = await fetch(
              "https://api.uinsgd.ac.id/salam/v2/auth/mahasiswa/login",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
              }
            );

            if (!authResponse.ok) {
              return null;
            }

            const user = await authResponse.json();
            console.log("user", user);

            // Return an object with the username property
            return { ...user, username: credentials.username };
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;

          // console.log("credentials", credentials);
          // return (result);

          // Access the array inside data and return it directly
          // const dataArray = user.data.data;
          // console.log("dataArray", dataArray);
          // return {user, dataArray};
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      // Set user properties in the session
      session.user.token = token.id;
      session.user.username = token.username;
      if (token.image != null) {
        session.user.image = token.image;
      } else {
        session.user.image = token.image2;
      }
      session.user.role = token.role;

      return session;
    },
    jwt({ token, account, user }) {
      // Set token properties
      if (account) {
        token.id = user?.data?.token;
        token.username = user.username;
        token.image = user?.data?.data[0]?.foto_user_new;
        token.image2 = user?.image;
        token.role = user?.role;
        if (user.username.length === 10) {
          token.role = "mahasiswa";
        }
        if (user.username.length === 18) {
          token.role = "dosen";
        }
        if (user.username.length === 12) {
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
  },
});
