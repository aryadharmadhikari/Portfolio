import Icon from "../Icon.jsx";

export default function Home({ profile }) {
  return (
    <div className="home-page">
      <section className="introduction">
        <h1>Hi, I’m Arya.</h1>
        <p>
          I’m an engineering apprentice at Frappe and a student at DBIT, Mumbai.
          I enjoy building for the web, learning in the open, and helping others
          get started.
        </p>
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
    </div>
  );
}
