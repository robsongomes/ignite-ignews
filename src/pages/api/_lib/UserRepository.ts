import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";

export interface User {
  ref: object;
  data: {
    email: string;
    stripe_customer_id: string;
  };
}

export class UserRepository {
  async findByCustomerId(customerId: string): Promise<User> {
    return fauna.query(
      q.Select(
        "ref",
        q.Get(q.Match(q.Index("users_by_stripe_customer_id"), customerId))
      )
    );
  }
}
