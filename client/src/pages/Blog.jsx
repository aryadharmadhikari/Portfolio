import { useState } from "react";
import { createRecord } from "../api.js";
import useCollection from "../useCollection.js";

function PostForm({ onCreated }) {
  const [form, setForm] = useState({ title: "", excerpt: "", body: "", tags: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const post = await createRecord("posts", { ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) });
      onCreated(post);
      setForm({ title: "", excerpt: "", body: "", tags: "" });
      setMessage("Note saved.");
    } catch (error) {
      setMessage(error.message === "Failed to fetch" ? "Couldn’t connect to the server. Please try again." : error.message);
    } finally {
      setBusy(false);
    }
  }

  return <details className="add-form"><summary>Write a note</summary><form onSubmit={handleSubmit}>
    <label>Title<input required maxLength="100" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
    <label>Short introduction<input required maxLength="240" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></label>
    <label>Your note<textarea required rows="5" maxLength="10000" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></label>
    <label>Topics, separated by commas<input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
    <button className="button" disabled={busy}>{busy ? "Saving…" : "Save note"}</button>
    {message && <p className="form-status" role="status">{message}</p>}
  </form></details>;
}

export default function Blog() {
  const { records: posts, status, addRecord } = useCollection("posts");
  return <section className="content-page">
    <h1>Blog</h1>
    <p className="page-description">Notes on things I’m learning and building.</p>
    {status === "loading" && <p className="empty-state">Loading notes…</p>}
    {status === "error" && <p className="empty-state" role="status">Couldn’t load notes. Please check the server connection.</p>}
    {status === "ready" && posts.length === 0 && <p className="empty-state">No notes here yet.</p>}
    {posts.length > 0 && <div className="post-list">
      {posts.map((post) => <article className="post" key={post._id}>
        <p className="post-meta"><time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>{post.tags?.length > 0 && <> · {post.tags.join(" · ")}</>}</p>
        <h2>{post.title}</h2><p className="post-excerpt">{post.excerpt}</p>
        {post.body && <details className="read-note"><summary>Read note</summary><p>{post.body}</p></details>}
      </article>)}
    </div>}
    <PostForm onCreated={addRecord} />
  </section>;
}

function formatDate(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
}
