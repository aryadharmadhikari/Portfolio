import { useEffect, useRef, useState } from "react";
import { fetchGitHubContributions } from "../lib/githubContributions.js";

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const SKELETON_WEEKS = Array(53).fill(Array(7).fill({}));

export default function GitHubContributions({ username }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    setError(false);

    fetchGitHubContributions(username, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== "AbortError") setError(true);
      });

    return () => controller.abort();
  }, [username, attempt]);

  function showTooltip(text, event) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = event.currentTarget.getBoundingClientRect();
    const x = cellRect.left - wrapRect.left + cellRect.width / 2;
    setTooltip({
      text,
      left: Math.max(108, Math.min(x, wrapRect.width - 108)),
      top: cellRect.top - wrapRect.top,
    });
  }

  const weeks = data?.weeks || SKELETON_WEEKS;
  const heading = data
    ? `${data.total.toLocaleString()} contributions in the last year`
    : error
      ? "Unable to load GitHub contributions right now."
      : "Loading contributions in the last year…";

  return (
    <section className="gh-section" aria-labelledby="gh-heading">
      <div className="gh-top">
        <h2 id="gh-heading" className="gh-title">{heading}</h2>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" className="gh-link">
          @{username}
        </a>
      </div>

      <div className="gh-box">
        {error ? (
          <button type="button" className="gh-retry" onClick={() => setAttempt((n) => n + 1)}>
            Retry
          </button>
        ) : (
          <div className="gh-wrap" ref={wrapRef} onMouseLeave={() => setTooltip(null)}>
            {tooltip && (
              <div className="gh-tooltip" role="status" style={{ left: tooltip.left, top: tooltip.top }}>
                {tooltip.text}
              </div>
            )}

            <div className="gh-scroll">
              <table className="gh-table" role="grid" aria-readonly="true" aria-label={`GitHub contribution graph for ${username}`}>
                <thead>
                  <tr className="gh-month-row">
                    <td className="gh-axis" />
                    {data ? data.months.map((m, i) => (
                      <td key={`${m.month}-${i}`} colSpan={m.span} className="gh-month-cell">
                        {m.show && <span className="gh-month-label">{m.month}</span>}
                      </td>
                    )) : <td colSpan={53} />}
                  </tr>
                </thead>
                <tbody>
                  {DAY_LABELS.map((label, row) => (
                    <tr key={row}>
                      <td className="gh-day-cell">
                        {label && <span className="gh-day-label">{label}</span>}
                      </td>
                      {weeks.map((week, col) => {
                        const day = week[row];
                        if (!day) return <td key={`e-${col}-${row}`} />;
                        if (!day.date) return <td key={`s-${col}-${row}`} className="gh-cell" />;
                        return (
                          <td
                            key={day.date}
                            className="gh-cell"
                            data-level={day.level}
                            aria-label={day.label}
                            onMouseEnter={(e) => showTooltip(day.label, e)}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="gh-footer">
          <a
            href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
            target="_blank"
            rel="noreferrer"
            className="gh-link"
          >
            Learn how we count contributions
          </a>
          <div className="gh-legend" aria-label="Contribution intensity legend">
            Less
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className="gh-cell" data-level={level} aria-hidden="true" />
            ))}
            More
          </div>
        </div>
      </div>
    </section>
  );
}
