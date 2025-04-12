import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import userLogIn from "@/libs/userLogIn";

export const authOptions: AuthOptions = {
  providers: [
      CredentialsProvider({
          name: "credentials",
          credentials: {},
          async authorize(credentials) {
            // console.log("Received credentials:", credentials);
              if (!credentials) return null;

              const { email, password } = credentials as { email: string; password: string };

              const user = await userLogIn({ userEmail: email, userPassword: password });

              try {
                  
                //   console.log(user);

                  if (!user) {
                      throw new Error('Invalid user');
                  }

                //   console.log("Authorized user:", user);
                  return user;
              } catch (error) {
                  console.error('Error during authorization:', error);
                  throw new Error('Invalid credentials');
              }
          }
      })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
      signIn: "/login"
  },
  callbacks: {
      async jwt({ token, user }) {
          return { ...token, ...user };
      },
      async session({ session, token, user }) {
          session.user = token as any;
          return session;
      }
  }
};