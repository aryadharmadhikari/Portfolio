import { photos } from "../content/photos.js";

export default function Photos() {
  return <section className="content-page">
    <h1>Photos</h1>
    <p className="page-description">A few things I’ve seen along the way.</p>
    {photos.length === 0 ? <p className="empty-state">No photos here yet.</p> : <div className="photo-grid">
      {photos.map((photo) => <figure className="photo-item" key={photo.src} data-orientation={photo.orientation}>
        <img src={photo.src} alt={photo.title} loading="lazy" />
        <figcaption><span>{photo.title}</span>{photo.location && <span className="photo-location">{photo.location}</span>}</figcaption>
      </figure>)}
    </div>}
  </section>;
}
