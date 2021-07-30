import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function faunadb(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const customerId = "cus_Juekme00J3qXLV";

  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(q.Match(q.Index("users_by_stripe_customer_id"), customerId))
    )
  );

  const userId = "304945368327520836";
  const user = await fauna.query(q.Get(q.Ref(q.Collection("users"), userId)));

  const subscription = await fauna.query(
    q.Paginate(
      q.Match(
        q.Index("subscriptions_by_id"),
        q.Call(q.Function("getSubscription"), "sub_JuxI1keMQfyVAy")
      )
    )
  );

  res.json(JSON.stringify(subscription));
}
