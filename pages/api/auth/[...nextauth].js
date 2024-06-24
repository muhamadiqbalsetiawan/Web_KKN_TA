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
          // console.error("Error finding user in database:", err);
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

async function findAdminInDatabase(credentials, res) {
  return new Promise((resolve, reject) => {
    condb.query(
      "SELECT * FROM superadmin WHERE username = ? AND password = ?",
      [credentials.username, credentials.password],
      (err, results) => {
        if (err) {
          // console.error("Error finding user in database:", err);
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
          if (credentials.token) {
            const authResponse = await fetch(
              "https://sip.uinsgd.ac.id/sip_module/ws/login",
              {
                method: "POST",
                body: new URLSearchParams(credentials),
              }
            );

            const user = await authResponse.json();

            if (
              user.message === "Password Salah" ||
              user.message === "NIP Tidak terdaftar di database SIP"
            ) {
              return null;
            } else {
              // Return an object with the username property
              return { ...user, username: credentials.username };
            }
          } else {
            const userInDatabase = await findUserInDatabase(credentials);

            // console.log(userInDatabase);

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
              } else {
                const user = await authResponse.json();
                // console.log("user", user);

                // Return an object with the username property
                return { ...user, username: credentials.username };
              }
            }
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
      if (token.username != null) {
        session.user.username = token.username;
      } else if (token.username2 != null) {
        session.user.username = token.username2;
      } else {
        session.user.username = token.username3;
      }

      if (token.image != null) {
        session.user.image = token.image;
      } else if (token.image2 != null) {
        session.user.image = token.image2;
      } else {
        session.user.image = token.image3;
      }
      if (token.role === "Dosen") {
        session.user.role = "dosen";
      } else if (token.role2 != null) {
        session.user.role = token.role2;
      } else {
        session.user.role = "mahasiswa";
      }

      session.user.name = token.nama;
      session.user.hp = token.hp;

      return session;
    },
    jwt({ token, account, user }) {
      // Set token properties
      if (account) {
        token.id = user?.data?.token;
        token.username = user?.data?.data[0]?.username;
        token.username2 = user?.nip;
        token.username3 = user.username;
        token.image = user?.data?.data[0]?.foto_user_new;
        token.image2 = user?.image;
        token.image3 = user?.foto;
        token.nama = user?.nama;
        token.role = user?.status;
        token.role2 = user?.role;
        token.hp = user?.profil?.nomor_hp;
      }

      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge : 10 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});
