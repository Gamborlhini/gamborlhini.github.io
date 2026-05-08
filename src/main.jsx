import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
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
    title: 'Canary: Free Flap Prognosis',
    description: 'Johns Hopkins Design Team project mentored by \
    Michelle Zwernemann, Dr. Cecil Qiu and Dr. Hooman Soltanian',
    image: '/assets/imgs/dt_image.png',
    href: 'https://engineering.jhu.edu/designcenter/design-gallery/entry/46203/',
    meta: 'design',
  },
  {
    title: 'Jet Engine',
    description: 'High school capstone project building a small jet engine model',
    image: '/assets/imgs/jet_image.png',
    href: 'https://jetengine.subhas.net',
    meta: 'capstone',
  },
  {
    title: 'Nota',
    description: 'A note-taking project for UHACKSWES hackathon.',
    image: '/assets/imgs/p1.svg',
    href: 'https://gamborlhini.github.io/UHACKSWES',
    meta: 'web app',
  },
  {
    title: 'Slimy Portals',
    description: 'A built-from-scratch game in collaboration with Shivam Engineer.',
    image: '/assets/imgs/p3.jpg',
    href: 'https://gamborlhini.github.io/Slimy_Portals',
    meta: 'game',
  },
  {
    title: 'CDC Simulator',
    description: 'Downloadable game for Hacks Academy Hackathon.',
    image: '/assets/imgs/CDCSim.png',
    href: '/assets/downloads/CDCSim.zip',
    meta: 'game',
    download: true,
  },
  {
    title: 'Little Programs',
    description: 'A collection of trivial utilities.',
    image: '/assets/imgs/p2.jpg',
    href: 'https://gamborlhini.github.io/LittlePrograms',
    meta: 'web app',
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

  useEffect(() => {
    const onHashChange = () => {
      setActiveRoute(getRouteFromHash());
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

function HomePage() {
  return (
    <section className="landing-page">
      <div className="landing-copy">
        <p className="kicker">Cleveland, OH | Baltimore, MD</p>
        <h1>Nikhil Subhas</h1>
        <p className="lede">
          Class of 2026 student at Johns Hopkins University majoring in Biomedical Engineering. 
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
      title="Translational Biomedical Engineer"
      intro="Biomedical Engineering student at Johns Hopkins University focused on 
      medical devices, imaging, and clinical innovation."
    >
      <div className="bio-layout">
        <figure>
          <img src="/assets/imgs/bio_image.jpeg" alt="Nikhil Subhas" />
          <figcaption>Nikhil Subhas / Baltimore, MD</figcaption>
        </figure>
        <div className="prose">
          <p>
            I have a focus in Imaging and Medical Devices with a minor in Applied Mathematics and Statistics. 
            My work sits at the intersection of engineering, clinical care, and data-driven medical technology.
          </p>
          <p>
            I hope to engineering, imaging, and data-driven methods to practical clinical challenges. 
            Through design, research, and clinical imaging experiences at Johns Hopkins and Cleveland Clinic, 
            I have developed interests in medical devices, diagnostic imaging, and technologies that improve patient care.
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
      title="Selected research"
      intro="A working index of my publications"
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
      title="Projects"
      intro="A curated set of academic and recreational websites, games, 
      and downloadable work."
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
