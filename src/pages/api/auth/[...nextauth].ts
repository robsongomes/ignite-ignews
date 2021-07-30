import { query as q } from "faunadb";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: "read:user",
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_KEY,
  },
  callbacks: {
    async session(session) {
      try {
        const userSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscriptions_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("users_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscriptions_by_status"), "active"),
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("users_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), {
              data: {
                email,
              },
            }),
            q.Get(q.Match(q.Index("users_by_email"), q.Casefold(email)))
          )
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
});
