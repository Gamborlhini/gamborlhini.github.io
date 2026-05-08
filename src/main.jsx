import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Menu,
  X,
} from 'lucide-react';
import './styles.css';

const routes = {
  home: '/',
  bio: '/bio',
  publications: '/publications',
  portfolio: '/portfolio',
};

const navItems = [
  { route: 'bio', label: 'Bio' },
  { route: 'publications', label: 'Publications' },
  { route: 'portfolio', label: 'Portfolio' },
];

const projects = [
  {
    title: 'JHU Design Center Project',
    description: 'A Johns Hopkins Engineering Design Center gallery project entry.',
    image: '/assets/imgs/project-jhu-placeholder.svg',
    href: 'https://engineering.jhu.edu/designcenter/design-gallery/entry/46203/',
    meta: 'design center',
  },
  {
    title: 'Jet Engine',
    description: 'A standalone project website hosted at jetengine.subhas.net.',
    image: '/assets/imgs/project-jetengine-placeholder.svg',
    href: 'https://jetengine.subhas.net',
    meta: 'project site',
  },
  {
    title: 'Nota',
    description: 'A collaborative project from UHACKSWES.',
    image: '/assets/imgs/p1.svg',
    href: 'https://gamborlhini.github.io/UHACKSWES',
    meta: 'web project',
  },
  {
    title: 'Slimy Portals',
    description: 'A game project with custom mechanics and visual assets.',
    image: '/assets/imgs/p3.jpg',
    href: 'https://gamborlhini.github.io/Slimy_Portals',
    meta: 'game',
  },
  {
    title: 'CDC Simulator',
    description: 'A downloadable simulation package.',
    image: '/assets/imgs/CDCSim.png',
    href: '/assets/downloads/CDCSim.zip',
    meta: 'download',
    download: true,
  },
  {
    title: 'Little Programs',
    description: 'A collection of focused programming experiments and small utilities.',
    image: '/assets/imgs/p2.jpg',
    href: 'https://gamborlhini.github.io/LittlePrograms',
    meta: 'programming archive',
  },
];

const publications = [
  {
    title:
      'Automated 3D segmentation of rotator cuff muscle and fat from longitudinal CT for shoulder arthroplasty evaluation',
    authors: 'Yang M, Jun BJ, Owings T, Subhas N, et al.',
    venue: 'Skeletal Radiology',
    date: '2025',
    description:
      'Published online August 9, 2025. Epub ahead of print. PMID: 40782188; PMCID: PMC12338071.',
    doi: '10.1007/s00256-025-04991-6',
    href: 'https://doi.org/10.1007/s00256-025-04991-6',
  },
  {
    title:
      'Bisphosphonate Use and Cardiovascular Outcomes According to Kidney Function Status in Post-Menopausal Women: An Emulated Target Trial from the Multi-Ethnic Study of Atherosclerosis',
    authors: 'Ghotbi E, Subhas N, et al.',
    venue: 'Diagnostics',
    date: '2025',
    description:
      'Diagnostics. 2025; 15(13):1727.',
    doi: '10.3390/diagnostics15131727',
    href: 'https://doi.org/10.3390/diagnostics15131727',
  },
  {
    title:
      'Non-cardiovascular Calcification Measures and Warranty Period of a Zero CAC in Young Adults: the Multi-ethnic Study of Atherosclerosis',
    authors: 'Ghotbi E, Nasir K, Bancks MP, Subhas N, et al.',
    venue: 'Academic Radiology',
    date: '2025',
    description:
      'Published online August 4, 2025. Epub ahead of print. PMID: 40764198.',
    doi: '10.1016/j.acra.2025.06.002',
    href: 'https://doi.org/10.1016/j.acra.2025.06.002',
  },
];

function getRouteFromHash() {
  const route = window.location.hash.replace(/^#/, '') || routes.home;
  return Object.values(routes).includes(route) ? route : routes.home;
}

function routeHref(route) {
  return `#${routes[route]}`;
}

function App() {
  const [activeRoute, setActiveRoute] = useState(getRouteFromHash);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setActiveRoute(getRouteFromHash());
      setIsMenuOpen(false);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const activePage = useMemo(
    () => Object.entries(routes).find(([, route]) => route === activeRoute)?.[0] || 'home',
    [activeRoute],
  );

  return (
    <>
      {activePage !== 'home' && (
        <Header activePage={activePage} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      )}
      <main>
        {activePage === 'home' && <HomePage />}
        {activePage === 'bio' && <BioPage />}
        {activePage === 'publications' && <PublicationsPage />}
        {activePage === 'portfolio' && <PortfolioPage />}
      </main>
      <Footer />
    </>
  );
}

function Header({ activePage, isMenuOpen, setIsMenuOpen }) {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <button
          className="menu-button"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className={`nav-links ${isMenuOpen ? 'is-open' : ''}`}>
          <a className={activePage === 'home' ? 'is-active' : ''} href="#/">
            Home
          </a>
          {navItems.map((item) => (
            <a
              className={activePage === item.route ? 'is-active' : ''}
              href={routeHref(item.route)}
              key={item.route}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <section className="landing-page">
      <div className="landing-copy">
        <p className="kicker">student / developer / builder</p>
        <h1>Nikhil Subhas</h1>
        <p className="lede">
          I build web projects, small programs, simulations, and research tools.
          This site is a compact index for my work, writing, background, and contact
          information.
        </p>
      </div>

      <div className="landing-grid" aria-label="Site sections">
        {navItems.map((item) => (
          <a className="landing-link" href={routeHref(item.route)} key={item.route}>
            <span>{item.label}</span>
            <ArrowUpRight size={20} />
          </a>
        ))}
      </div>
    </section>
  );
}

function PageFrame({ eyebrow, title, intro, children }) {
  return (
    <section className="page-frame">
      <a className="back-link" href="#/">
        <ArrowLeft size={18} />
        Home
      </a>
      <div className="page-heading">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className="lede">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function BioPage() {
  return (
    <PageFrame
      eyebrow="bio"
      title="Learning is my passion."
      intro="I am interested in web development, app development, 3D printing, debate, and building projects that connect programming to other fields."
    >
      <div className="bio-layout">
        <figure>
          <img src="/assets/imgs/avatar_hat.jpg" alt="Nikhil Subhas" />
          <figcaption>Nikhil Subhas / Cleveland, Ohio</figcaption>
        </figure>
        <div className="prose">
          <p>
            Throughout my elementary years I enjoyed math and science. It was then I
            learned I love learning. As I progressed through school, I began to engage
            in coding and enjoyed the logical and problem-solving challenges.
          </p>
          <p>
            I started applying programming to other fields by creating websites that
            extended aspects of my classes. I currently enjoy web development and have
            been learning about app development for both mobile and Windows devices.
          </p>
          <p>
            This website serves as a router to projects hosted on GitHub Pages, a
            compact portfolio, and a contact sheet that I can keep updating as my work
            changes.
          </p>
        </div>
      </div>
    </PageFrame>
  );
}

function PublicationsPage() {
  return (
    <PageFrame
      eyebrow="publications"
      title="Selected research and writing."
      intro="A working index for research scripts, downloadable materials, and future publications."
    >
      <div className="list-stack">
        {publications.map((item) => (
          <a
            className="publication-card"
            href={item.href}
            key={item.title}
            target="_blank"
            rel="noreferrer"
          >
            <span>
              <p className="item-meta">
                {item.venue} / {item.date}
              </p>
              <h2>{item.title}</h2>
              <p className="authors">{item.authors}</p>
              <p>{item.description}</p>
              <span className="doi-line">doi: {item.doi}</span>
            </span>
            <ArrowUpRight size={20} />
          </a>
        ))}
      </div>
    </PageFrame>
  );
}

function PortfolioPage() {
  return (
    <PageFrame
      eyebrow="portfolio"
      title="Projects and experiments."
      intro="A curated set of websites, games, and downloadable work."
    >
      <div className="portfolio-list">
        {projects.map((project) => (
          <a
            className="portfolio-item"
            href={project.href}
            key={project.title}
            target={project.download ? undefined : '_blank'}
            rel={project.download ? undefined : 'noreferrer'}
            download={project.download ? true : undefined}
          >
            <img src={project.image} alt={project.title} />
            <span>
              <span className="item-meta">{project.meta}</span>
              <strong>{project.title}</strong>
              <span>{project.description}</span>
            </span>
            {project.download ? <Download size={20} /> : <ArrowUpRight size={20} />}
          </a>
        ))}
      </div>
    </PageFrame>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>© Nikhil Subhas</p>
      <div>
        <a href="mailto:nikhil@subhas.net">Email</a>
        <a href="https://github.com/gamborlhini" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com/in/nikhil-subhas-2a8067176" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </footer>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
