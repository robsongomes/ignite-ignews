import { GetStaticProps, GetStaticPropsContext } from "next";
import Head from "next/head";
import styles from "./styles.module.scss";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import { prismicClient } from "../../services/prismic";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Ignews | Posts</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const response = await prismicClient.query(
    [Prismic.predicates.at("document.type", "post")],
    {
      fetch: ["post.title", "post.content"],
      pageSize: 100,
    }
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find((content) => content.type === "paragraph")?.text ??
      "",
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  }));

  return {
    props: {
      posts,
    },
  };
};
