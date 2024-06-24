import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "../../../lib/db";

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
        const { username, password } = credentials;

        try {
          const [rows] = await db.promise().query(
            'SELECT * FROM akun WHERE akun_nim = ? AND akun_pw = ?',
            [username, password]
          );

          if (rows && rows.length === 1) {
            // Check if the user already has a role
            const existingRole = rows[0].roles;

            // If roles is null, assign based on conditions, otherwise, validate existing roles
            const newRole = existingRole || assignRoleBasedOnConditions(username);

            // Validate the role
            if (!validateRole(newRole)) {
              console.warn('Invalid role:', newRole);
              return Promise.resolve(null);
            }

            // Update the 'roles' column in the database
            await updateRolesInDatabase(rows[0].akun_id, newRole);

            // Authentication successful
            const user = {
              id: rows[0].akun_id,
              name: rows[0].akun_nim,
              role: newRole,
            };

            return Promise.resolve(user);
          }
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
      session.user.role = token.role;
      session.user.roles = [token.role];
      return session;
    },
  }
});

// Function to assign role based on conditions
const assignRoleBasedOnConditions = (username) => {
  // Check if the username length is 10
  if (username.length === 10) {
    return 'mahasiswa';
  }
  // Check if the username length is 15
  else if (username.length === 15) {
    return 'dosen';
  }
  // Check if the username starts with 'super'
  else if (username.toLowerCase().startsWith('super')) {
    return 'superadmin';
  }
  // Check if the username is 'admin'
  else if (username.toLowerCase() === 'admin') {
    return 'admin';
  }

  // Default to an empty role if no specific roles are assigned
  return '';
};

// Function to validate the role
const validateRole = (role) => {
  const predefinedRoles = ['mahasiswa', 'admin', 'dosen', 'superadmin'];
  return predefinedRoles.includes(role);
};

// Function to update 'roles' column in the database
const updateRolesInDatabase = async (userId, role) => {
  try {
    // Update the 'roles' column in your 'akun' table
    await db.promise().query('UPDATE akun SET roles = ? WHERE akun_id = ?', [role, userId]);
  } catch (error) {
    console.error('Error updating roles in the database:', error);
  }
};