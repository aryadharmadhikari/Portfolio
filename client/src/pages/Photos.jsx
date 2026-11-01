import { useState } from "react";
import { createRecord } from "../api.js";
import useCollection from "../useCollection.js";

function PhotoForm({ onCreated }) {
  const [form, setForm] = useState({ title: "", location: "", imageUrl: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const photo = await createRecord("photos", form);
      onCreated(photo);
      setForm({ title: "", location: "", imageUrl: "" });
      setMessage("Photo added.");
    } catch (error) {
      setMessage(error.message === "Failed to fetch" ? "Couldn’t connect to the server. Please try again." : error.message);
    } finally {
      setBusy(false);
    }
  }

  return <details className="add-form"><summary>Add a photo</summary><form onSubmit={handleSubmit}>
    <label>Caption<input required maxLength="100" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
    <label>Place <span className="optional">Optional</span><input maxLength="100" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
    <label>Image address<input type="url" required placeholder="https://…" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></label>
    <button className="button" disabled={busy}>{busy ? "Adding…" : "Add photo"}</button>
    {message && <p className="form-status" role="status">{message}</p>}
  </form></details>;
}

export default function Photos() {
  const { records: photos, status, addRecord } = useCollection("photos");
  return <section className="content-page">
    <h1>Photos</h1>
    <p className="page-description">A few things I’ve seen along the way.</p>
    {status === "loading" && <p className="empty-state">Loading photos…</p>}
    {status === "error" && <p className="empty-state" role="status">Couldn’t load photos. Please check the server connection.</p>}
    {status === "ready" && photos.length === 0 && <p className="empty-state">No photos here yet.</p>}
    {photos.length > 0 && <div className="photo-grid">
      {photos.map((photo) => <figure className="photo-item" key={photo._id}>
        <img src={photo.imageUrl} alt={photo.title} loading="lazy" />
        <figcaption><span>{photo.title}</span>{photo.location && <span className="photo-location">{photo.location}</span>}</figcaption>
      </figure>)}
    </div>}
    <PhotoForm onCreated={addRecord} />
  </section>;
}
