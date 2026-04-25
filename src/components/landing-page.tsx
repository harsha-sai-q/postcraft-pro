"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useState, type ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.04 } }
};

const features = [
  ["AI post generator", "Turn rough thoughts into structured LinkedIn posts."],
  ["Formatted output", "Get cleaner spacing and LinkedIn-friendly formatting."],
  ["Engagement readiness score", "Review hook strength, readability, CTA clarity, and hashtag relevance."],
  ["Image prompt generator", "Create matching visual prompts for AI image tools."],
  ["Competitor analyzer", "Learn what makes other posts work."],
  ["Saved post history", "Save, restore, copy, and reuse your best drafts."]
] as const;

function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          PostCraft Pro
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <Link href="#features" className="hover:text-slate-900">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-slate-900">
            How it works
          </Link>
          <Link href="/login" className="hover:text-slate-900">
            Login
          </Link>
          <Link href="/signup" className="btn-primary">
            Start writing
          </Link>
        </nav>
        <button type="button" className="btn-secondary md:hidden" onClick={() => setOpen((value) => !value)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <Link href="#features" onClick={() => setOpen(false)}>
              Features
            </Link>
            <Link href="#how-it-works" onClick={() => setOpen(false)}>
              How it works
            </Link>
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/signup" className="btn-primary w-full" onClick={() => setOpen(false)}>
              Start writing
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeroPreview() {
  return (
    <motion.article
      variants={fadeUp}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">LinkedIn Draft</p>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Score 85
        </span>
      </div>
      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Topic</p>
          <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            Lessons I learned building my first AI product
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Generated post</p>
          <p className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-700">
            I used to think sharing unfinished work would hurt credibility. It actually built trust faster. Weekly updates
            brought better feedback, faster decisions, and stronger connections.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-violet-700">Image prompt ready</span>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-slate-700">Formatted output on</span>
        </div>
      </div>
    </motion.article>
  );
}

function MotionSection({
  id,
  title,
  subtitle,
  children
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      id={id}
      className="mx-auto max-w-6xl px-4 py-16 md:px-8"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-3 text-sm text-slate-600 md:text-base">{subtitle}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

export default function LandingPage() {
  return (
    <div>
      <LandingNav />

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 md:grid-cols-2 md:px-8 md:pb-20 md:pt-20">
          <motion.div initial="hidden" animate="show" variants={staggerContainer}>
            <motion.h1 variants={fadeUp} className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Write better LinkedIn posts in minutes
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 text-base text-slate-600 md:text-lg">
              PostCraft Pro turns rough ideas into polished LinkedIn posts with formatted output, engagement scoring,
              image prompts, and saved history.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="btn-primary">
                Start writing
              </Link>
              <Link href="/login" className="btn-secondary">
                Log in
              </Link>
            </motion.div>
          </motion.div>
          <HeroPreview />
        </section>

        <MotionSection
          title="Blank page? Flat posts? No formatting?"
          subtitle="LinkedIn rewards strong hooks, clean structure, and clear calls to action. But most people start with a rough idea and end up with a flat wall of text."
        >
          <motion.div
            className="grid gap-4 md:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              ["No clear hook", "Great ideas often start weak and get ignored."],
              ["Wall-of-text drafts", "Poor spacing makes posts hard to read."],
              ["Unclear CTA", "Without a clear next step, readers move on."]
            ].map(([title, description]) => (
              <motion.article key={title} variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </motion.article>
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection id="how-it-works" title="How it works">
          <motion.div className="grid gap-4 md:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {[
              ["1", "Add your idea", "Start with a topic, thought, story, or rough note."],
              ["2", "Choose your style", "Pick tone, format, and length for the kind of post you want."],
              ["3", "Generate and refine", "Get a formatted post, AI score, image prompt, and saved draft."]
            ].map(([index, title, description]) => (
              <motion.article key={title} variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">{index}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </motion.article>
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection id="features" title="Everything you need to write with confidence">
          <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {features.map(([title, description]) => (
              <motion.article
                key={title}
                variants={fadeUp}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
              >
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{description}</p>
              </motion.article>
            ))}
          </motion.div>
        </MotionSection>

        <MotionSection title="Built for founders, creators, marketers, freelancers, and professionals">
          <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {["🚀 Founders", "🎥 Creators", "📣 Marketers", "🧠 Freelancers", "💼 Professionals"].map((audience) => (
              <motion.article key={audience} variants={fadeUp} className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm font-medium text-slate-700 shadow-sm">
                {audience}
              </motion.article>
            ))}
          </motion.div>
        </MotionSection>

        <motion.section
          className="mx-auto max-w-6xl px-4 pb-20 md:px-8"
          initial="hidden"
          whileInView="show"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-12 text-center text-white shadow-sm md:px-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Your next LinkedIn post starts with one idea.</h2>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/signup" className="btn-secondary border-white bg-white text-slate-900 hover:bg-slate-100">
                Start writing
              </Link>
              <Link href="/dashboard" className="btn-secondary border-white/40 bg-white/5 text-white hover:bg-white/10">
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
