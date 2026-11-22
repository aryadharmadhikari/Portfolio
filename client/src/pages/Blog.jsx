import { posts } from "../content/posts.js";

export default function Blog() {
  return <section className="content-page">
    <h1>Blog</h1>
    <p className="page-description">Notes on things I’m learning and building.</p>
    {posts.length === 0 ? <p className="empty-state">No notes here yet.</p> : <div className="post-list">
      {posts.map((post) => <article className="post" key={post.slug}>
        {post.date && <p className="post-meta"><time dateTime={post.date}>{formatDate(post.date)}</time>{post.tags?.length > 0 && <> · {post.tags.join(" · ")}</>}</p>}
        <h2>{post.title}</h2>
        {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
        {post.body && <details className="read-note"><summary>Read note</summary><p>{post.body}</p></details>}
      </article>)}
    </div>}
  </section>;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}
