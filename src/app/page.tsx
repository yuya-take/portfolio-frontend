import { ContactForm } from "@/components/site/contact-form";
import { InkCanvas } from "@/components/site/ink-canvas";
import { ProjectVisual } from "@/components/site/project-visual";
import { Lines, MotionProvider, Reveal } from "@/components/site/reveal";
import { GOOGLE_FORM_URL, type Project, chapters, contact, facts, profile, projects, skillGroups } from "@/lib/site";
import Link from "next/link";

const nav = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const INK = [17, 17, 17] as const;
const WHITE = [255, 255, 255] as const;

const container = "mx-auto w-full max-w-[1280px] px-5 md:px-10";
/** ページ全体で使う左右 2 段。狭い画面では 1 段に畳む */
const columns = "grid gap-y-10 lg:grid-cols-2 lg:gap-x-20";

// JS が無効でも、動きの初期状態（透明・ずらし）のまま隠れてしまわないようにする
const noScriptStyle = `[style*="opacity"]{opacity:1!important}[style*="transform"]{transform:none!important}`;

function ProfileLinks({ className }: { className?: string }) {
  return (
    <ul className={`flex gap-6 tracking-normal ${className ?? ""}`}>
      {profile.links.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="link">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ id, children, className }: { id: string; children: string; className?: string }) {
  return (
    <h2 id={`${id}-title`} className={`border-t pt-5 font-semibold tracking-normal ${className ?? "border-line"}`}>
      {children}
    </h2>
  );
}

function ProjectBand({ project }: { project: Project }) {
  const { theme, link } = project;
  const linkClass =
    "group inline-flex items-center gap-3 border border-card-fg/40 px-5 py-3 leading-normal transition-colors duration-300 hover:bg-card-fg hover:text-card-bg";
  const linkBody = (
    <>
      {link.label}
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: 装飾。aria-hidden で読み上げから外している */}
      <svg
        viewBox="0 0 14 10"
        className="h-2.5 w-3.5 transition-transform duration-300 ease-expo group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        aria-hidden
      >
        <path d="M0 5h12.5M8.5 1l4 4-4 4" />
      </svg>
    </>
  );

  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="bg-card-bg text-card-fg"
      style={
        {
          "--card-bg": theme.bg,
          "--card-fg": theme.fg,
          "--card-accent": theme.accent,
          "--card-panel": theme.panel,
        } as React.CSSProperties
      }
    >
      <div className={`${container} grid gap-y-10 py-14 md:py-20 lg:grid-cols-12 lg:gap-x-12`}>
        <Reveal className="flex flex-col lg:col-span-5">
          <h3
            id={`project-${project.slug}`}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[clamp(2.5rem,4.6vw,4rem)] font-semibold leading-none tracking-[-0.03em]"
          >
            {project.name}
            {project.status && (
              <span className="text-[13px] font-normal tracking-normal text-card-accent">{project.status}</span>
            )}
          </h3>
          <p className="display mt-6 text-balance text-[clamp(1.1rem,1.55vw,1.35rem)] leading-[1.75]">
            {project.tagline}
          </p>
          <p className="mt-5 text-sm leading-[1.95] text-card-fg/75">{project.description}</p>
          <dl className="mt-7 text-[13px] leading-relaxed">
            {project.features.map((feature) => (
              <div
                key={feature.title}
                className="grid gap-x-4 gap-y-0.5 border-t border-card-fg/15 py-3 sm:grid-cols-[10.5em_1fr]"
              >
                <dt className="font-semibold text-card-accent">{feature.title}</dt>
                <dd className="text-card-fg/75">{feature.desc}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-5 pt-10">
            <p className="text-[13px] tracking-normal text-card-fg/60">{project.tech.join(" / ")}</p>
            {link.href.startsWith("http") ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                {linkBody}
              </a>
            ) : (
              <Link href={link.href} className={linkClass}>
                {linkBody}
              </Link>
            )}
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <ProjectVisual slug={project.slug} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <MotionProvider>
      <noscript>
        <style>{noScriptStyle}</style>
      </noscript>

      <div className="text-[15px] leading-[1.95] tracking-[0.03em] text-ink">
        <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]">
            <InkCanvas
              line={INK}
              accent={INK}
              alpha={0.4}
              bands={6.5}
              drops={[{ x: 0.7, y: 0.36, strength: 1, delay: 0.5 }]}
            />
          </div>

          <header
            className={`${container} relative flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-6 tracking-normal md:py-8`}
          >
            <h1 className="font-semibold">{profile.name}</h1>
            <nav aria-label="ページ内">
              <ul className="flex gap-5 md:gap-8">
                {nav.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-sub transition-colors hover:text-ink">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <div className={`${container} relative mt-auto pb-8 pt-24 md:pb-10`}>
            <p className="tracking-normal text-sub">{profile.role}</p>
            <Lines
              lines={profile.tagline}
              delay={0.15}
              className="display mt-4 text-[7vw] leading-[1.5] sm:text-[clamp(2.4rem,5.6vw,4.75rem)] sm:leading-[1.42]"
            />
            <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-ink/15 pt-5 md:mt-14">
              <ProfileLinks />
              <p className="text-[13px] text-sub">
                <span className="[@media(hover:none)]:hidden">クリック</span>
                <span className="hidden [@media(hover:none)]:inline">タップ</span>
                すると墨が落ちます
              </p>
            </div>
          </div>
        </div>

        <main>
          <section id="about" aria-labelledby="about-title" className={`${container} scroll-mt-6 pt-24 md:pt-36`}>
            <SectionTitle id="about">About</SectionTitle>
            <div className={`${columns} mt-10 md:mt-14`}>
              <Reveal>
                {/* eslint-disable-next-line @next/next/no-img-element -- GitHub のアイコンをそのまま出すだけなので最適化は通さない */}
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] bg-line object-cover"
                />
                <dl className="mt-8 grid grid-cols-[5em_1fr] gap-y-1">
                  {facts.map((fact) => (
                    <div key={fact.label} className="contents">
                      <dt className="text-sub">{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <div className="max-w-[44em] space-y-10 lg:-mt-1.5">
                {chapters.map((chapter) => (
                  <Reveal key={chapter.title}>
                    <h3 className="font-semibold tracking-normal">{chapter.title}</h3>
                    <p className="mt-2">{chapter.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" aria-labelledby="projects-title" className="scroll-mt-6 pt-24 md:pt-36">
            <div className={container}>
              <SectionTitle id="projects">Projects</SectionTitle>
            </div>
            <div className="mt-10 md:mt-14">
              {projects.map((project) => (
                <ProjectBand key={project.slug} project={project} />
              ))}
            </div>
          </section>

          <section id="skills" aria-labelledby="skills-title" className={`${container} scroll-mt-6 pt-24 md:pt-36`}>
            <SectionTitle id="skills">Skills</SectionTitle>
            <dl className="mt-4 md:mt-8">
              {skillGroups.map((group, i) => (
                <Reveal key={group.name} delay={i * 0.04} className="border-t border-line first:border-t-0">
                  <div className="grid gap-y-2 py-6 lg:grid-cols-2 lg:items-baseline lg:gap-x-20">
                    <dt className="text-sub">{group.name}</dt>
                    <dd className="text-lg leading-[1.7] tracking-normal md:text-xl md:leading-[1.7]">
                      {group.skills.join(" / ")}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </section>
        </main>

        <section
          id="contact"
          aria-labelledby="contact-title"
          className="relative mt-24 overflow-hidden bg-ink text-white md:mt-36"
        >
          <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent_10%,black_75%)]">
            <InkCanvas line={WHITE} accent={WHITE} alpha={0.3} bands={6} seed={40} />
          </div>

          <div className={`${container} relative pb-20 pt-16 md:pb-28 md:pt-24`}>
            <SectionTitle id="contact" className="border-white/20">
              Contact
            </SectionTitle>
            <Lines
              lines={contact.lead}
              className="display mt-10 text-[5.6vw] leading-[1.7] sm:text-[clamp(1.6rem,3.4vw,2.75rem)] md:mt-14"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 text-white/70">{contact.note}</p>
              <ProfileLinks className="mt-5" />
              <div className="mt-10 max-w-[640px]">
                <ContactForm src={GOOGLE_FORM_URL} />
              </div>
            </Reveal>
          </div>

          <div className={`${container} relative`}>
            <footer className="flex justify-between border-t border-white/15 py-8 text-[13px] tracking-normal text-white/60">
              <p>© {profile.name}</p>
              <a href="#top" className="transition-colors hover:text-white">
                ページの先頭へ
              </a>
            </footer>
          </div>
        </section>
      </div>
    </MotionProvider>
  );
}
