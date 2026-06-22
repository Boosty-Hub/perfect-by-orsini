import Link from "next/link";
import type { BlogPost } from "@/content/schema";
import { BlogCover } from "@/components/BlogCover";
import { topicMeta, formatDate } from "@/lib/blog";

export function ArticleCard({ post }: { post: BlogPost }) {
  const t = topicMeta(post.topic);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-nude-200 bg-cream-50 transition-all hover:-translate-y-1 hover:border-nude-300 hover:shadow-lg hover:shadow-ink-900/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.cover && (
          <BlogCover
            src={post.cover}
            alt={post.title}
            sizes="(max-width: 768px) 92vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink-900/85 px-3 py-1 text-xs text-cream-50">
          {t?.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg leading-snug text-ink-900">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-nude-500">{post.excerpt}</p>
        <p className="mt-4 text-xs text-nude-400">
          {formatDate(post.publishedAt)} · {post.readingTime ?? 4} min de lectura
        </p>
      </div>
    </Link>
  );
}
