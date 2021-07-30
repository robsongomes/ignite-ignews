import Prismic from "@prismicio/client";

export const prismicClient = Prismic.client(
  process.env.PRISMIC_URL_ENTRY_POINT,
  {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  }
);
