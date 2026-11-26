import { useEffect, useState } from "react";
import { photos } from "../content/photos.js";

export default function Photos() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? photos[selectedIndex] : null;
  const step = (delta) => setSelectedIndex((i) => (i + delta + photos.length) % photos.length);

  useEffect(() => {
    if (selectedIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setSelectedIndex(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex]);

  return <section className="content-page">
    <h1>Photos</h1>
    <p className="page-description">A few things I’ve seen along the way.</p>
    {photos.length === 0 ? <p className="empty-state">No photos here yet.</p> : <div className="photo-grid">
      {photos.map((photo, index) => <figure className="photo-item" key={photo.src} data-orientation={photo.orientation}>
        <button
          type="button"
          className="photo-trigger"
          onClick={() => setSelectedIndex(index)}
          aria-label={`Expand ${photo.title}`}
        >
          <img src={photo.src} alt={photo.title} loading="lazy" />
        </button>
        <figcaption><span>{photo.title}</span>{photo.location && <span className="photo-location">{photo.location}</span>}</figcaption>
      </figure>)}
    </div>}
    {selected && (
      <div
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={selected.title}
        onClick={() => setSelectedIndex(null)}
      >
        <figure className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <img src={selected.src} alt={selected.title} />
          <figcaption>
            <span>{selected.title}</span>
            {selected.location && <span className="photo-location">{selected.location}</span>}
          </figcaption>
        </figure>
        {photos.length > 1 && (
          <div className="lightbox-nav" onClick={(e) => e.stopPropagation()}>
            {[[-1, "Previous photo", "15 18 9 12 15 6"], [1, "Next photo", "9 18 15 12 9 6"]].map(([delta, label, points]) => (
              <button key={label} type="button" className="lightbox-btn" onClick={() => step(delta)} aria-label={label}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points={points} />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    )}
  </section>;
}
