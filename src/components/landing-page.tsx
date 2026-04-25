"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: "easeOut" } }
};

type CardItem = { title: string; description: string; icon?: string };

const problemPoints = [
  { title: "No clear hook", description: "Great ideas often start weak and get ignored in the first line." },
  { title: "Wall-of-text drafts", description: "Posts lose readability when spacing and structure are missing." },
  { title: "Unclear CTA", description: "Without a clear next step, readers move on without engaging." }
];

const steps = [
  {
    title: "Add your idea",
    description: "Start with a topic, thought, story, or rough note."
  },
  {
    title: "Choose your style",
    description: "Pick tone, format, and length for the kind of post you want."
  },
  {
    title: "Generate and refine",
    description: "Get a formatted post, AI score, image prompt, and saved draft."
  }
];

const features: CardItem[] = [
  { title: "AI post generator", description: "Turn rough thoughts into structured LinkedIn posts.", icon: "✨" },
  { title: "Formatted output", description: "Get cleaner spacing and LinkedIn-friendly formatting.", icon: "🧩" },
  {
    title: "Engagement readiness score",
    description: "Review hook strength, readability, CTA clarity, and hashtag relevance.",
    icon: "📈"
  },
  { title: "Image prompt generator", description: "Create matching visual prompts for AI image tools.", icon: "🖼️" },
  { title: "Competitor analyzer", description: "Learn what makes other posts work.", icon: "🕵️" },
  { title: "Post history", description: "Save, restore, copy, and reuse your best drafts.", icon: "🗂️" }
];

const audiences: CardItem[] = [
  { title: "Founders", description: "Share vision, wins, and lessons with authority.", icon: "🚀" },
  { title: "Creators", description: "Publish consistently while keeping your voice clear.", icon: "🎥" },
  { title: "Marketers", description: "Turn campaigns into stories people remember.", icon: "📣" },
  { title: "Freelancers", description: "Show your process and attract better-fit clients.", icon: "🧠" },
  { title: "Professionals", description: "Build a personal brand through thoughtful content.", icon: "💼" }
];

function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-slate-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          PostCraft Pro
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <Link href="#features" className="hover:text-slate-900">Features</Link>
          <Link href="#how-it-works" className="hover:text-slate-900">How it works</Link>
          <Link href="/login" className="hover:text-slate-900">Login</Link>
          <Link href="/signup" className="btn-primary">Start writing</Link>
        </nav>
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          Menu
        </button>
      </div>
      {menuOpen ? (
        <div className="border-t border-white/60 bg-slate-50 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <Link href="#features" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="/signup" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>Start writing</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeroPreview() {
  return (
    <motion.article
      variants={scaleIn}
      initial="hidden"
      animate="show"
      className="relative rounded-3xl border border-white/60 bg-white/85 p-5 shadow-xl shadow-slate-300/50 backdrop-blur"
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700">LinkedIn Post Draft</p>
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
          >
            Score 86
          </motion.span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Topic</p>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              Building in public as an early-stage founder
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs font-medium text-slate-500">Generated post</p>
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-relaxed text-slate-700">
              I used to think sharing unfinished work made me look unprepared. Turns out it did the opposite.\n\nWhen I started
              posting weekly updates, I attracted better feedback, faster decisions, and stronger collaborators.
              Building in public is not noise. It is momentum.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
              Image prompt: “Founder working on product roadmap at night”
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Formatted output: ON
            </span>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

function MotionSection({ id, title, subtitle, children }: { id?: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-4 text-base text-slate-600 md:text-lg">{subtitle}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

function FeatureCard({ icon, title, description }: CardItem) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg"
    >
      <span className="mb-3 inline-flex text-2xl" role="img" aria-hidden="true">{icon}</span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </motion.article>
  );
}

function StepCard({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <motion.article variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {index}
      </p>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </motion.article>
  );
}

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]">
        <motion.div
          className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-16 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl"
          animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>

      <LandingNav />

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 md:grid-cols-2 md:px-8 md:pb-24 md:pt-20">
          <motion.div initial="hidden" animate="show" variants={staggerContainer} className="self-center">
            <motion.p variants={fadeUp} className="inline-flex rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              Turn ideas into publish-ready LinkedIn posts in minutes
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Write better LinkedIn posts in minutes
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base text-slate-600 md:text-lg">
              PostCraft Pro turns rough ideas into polished LinkedIn posts with formatted output, engagement scoring,
              image prompts, and saved history.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary">Start writing</Link>
              <Link href="/login" className="btn-secondary">Log in</Link>
            </motion.div>
          </motion.div>

          <HeroPreview />
        </section>

        <MotionSection
          title="Blank page? Flat posts? No formatting?"
          subtitle="LinkedIn rewards strong hooks, clean structure, and clear calls to action. But most people start with a rough idea and end up with a flat wall of text."
        >
          <motion.div className="grid gap-4 md:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            {problemPoints.map((item) => (
              <motion.article key={item.title} variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection id="how-it-works" title="How it works" subtitle="A simple flow from idea to publish-ready content.">
          <motion.div className="grid gap-4 md:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            {steps.map((step, idx) => (
              <StepCard key={step.title} index={idx + 1} title={step.title} description={step.description} />
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection id="features" title="Everything you need to write with confidence">
          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection title="Built for your workflow">
          <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {audiences.map((audience) => (
              <motion.article key={audience.title} variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
                <p className="text-2xl" role="img" aria-label={audience.title}>{audience.icon}</p>
                <h3 className="mt-2 text-base font-semibold text-slate-900">{audience.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{audience.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </MotionSection>

        <motion.section
          className="mx-auto max-w-6xl px-4 pb-20 md:px-8 md:pb-24"
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-14 text-center text-white shadow-xl md:px-10">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Your next LinkedIn post starts with one idea.</h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-200">
                Start writing
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
                Go to dashboard
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-semibold text-slate-900">PostCraft Pro</p>
            <p className="mt-1">AI-powered LinkedIn writing workspace.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-900">Login</Link>
            <Link href="/signup" className="hover:text-slate-900">Signup</Link>
            <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
