import Icon from "../Icon.jsx";
import GitHubContributions from "../components/GitHubContributions.jsx";

export default function Home({ profile }) {
  return (
    <div className="home-page">
      <section className="introduction">
        <div className="intro-header">
          {profile.avatar && (
            <div className="intro-avatar">
              <img src={profile.avatar} alt={profile.name} />
            </div>
          )}
          <div className="intro-text">
            <h1>Hi, I’m Arya.</h1>
            <p>
              I’m an engineering apprentice at Frappe and a student at DBIT, Mumbai.
              I enjoy building for the web, learning in the open, and helping others
              get started.
            </p>
          </div>
        </div>
        <div className="social-links" aria-label="Find me online">
          {profile.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
            >
              <Icon name={link.icon} />
            </a>
          ))}
        </div>
      </section>
      <GitHubContributions username={profile.githubUsername} />
    </div>
  );
}
