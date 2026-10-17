import { dogTrainingEssay, skincareEssay } from "./writings.js";

export const links = {
  email: "mailto:aditiharini@gmail.com",
  github: "https://github.com/aditiharini",
  linkedin: "https://www.linkedin.com/in/aditi-srinivasan-403076137",
};

export const timelineEntries = [
  {
    icon: "💧",
    date: "oct '26",
    category: "writing",
    parts: [
      { text: "Wrote " },
      {
        text: skincareEssay.title,
        writingToggle: true,
      },
      { text: ". " },
    ],
    writing: skincareEssay,
  },
  {
    icon: "🦮",
    date: "jul '26",
    category: "writing",
    parts: [
      { text: "Wrote " },
      {
        text: dogTrainingEssay.title,
        writingToggle: true,
      },
      { text: ". " },
    ],
    writing: dogTrainingEssay,
  },
  {
    icon: "🔧",
    date: "jul '26",
    parts: [{ text: "Built my first personal website. " }],
  },
  {
    icon: "💼",
    date: "feb '26",
    parts: [
      { text: "Joined " },
      { text: "Altara", emphasis: true, href: "https://www.altara.co/" },
      {
        text: " as engineer #2. ",
      },
    ],
  },
  {
    icon: "📍",
    date: "feb '26",
    parts: [{ text: "Moved to SF. " }],
  },
  {
    icon: "💍",
    date: "feb '26",
    parts: [
      { text: "Got engaged. " },
    ],
  },
  {
    icon: "♟️",
    date: "oct '25",
    parts: [{ text: "Played my first chess tournament. Went 1–3. " }],
  },
  {
    icon: "📍",
    date: "may '25",
    parts: [
      {
        text: "Moved to Manchester, NH. ",
      },
    ],
  },
  {
    icon: "🐕",
    date: "aug '24",
    parts: [
      { text: "Adopted " },
      {
        text: "Kaju",
        href: "https://www.instagram.com/p/C-YNlhvOBpK/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
      },
      { text: ". " },
    ],
  },
  {
    icon: "💼",
    date: "aug '24",
    parts: [
      { text: "Joined Farcaster, built " },
      { text: "Snapchain", href: "https://github.com/farcasterxyz/snapchain" },
      { text: ". " },
    ],
  },
  {
    icon: "🤸",
    date: "jun '23",
    parts: [
      { text: "Joined " },
      {
        text: "adult open gym",
        href: "https://www.gothamgymnastics.com/open-gyms",
      },
      { text: ", learned how to do a handstand. " },
    ],
  },
  {
    icon: "🦀",
    date: "dec '22",
    parts: [
      { text: "Did " },
      { text: "Advent of Code 2022", href: "https://adventofcode.com/2022" },
      { text: " in Rust. " },
    ],
  },
  {
    icon: "🏆",
    date: "dec '21",
    parts: [
      { text: "Hit my peak " },
      {
        text: "Barbu ladder",
        emphasis: true,
        href: "http://www.barbu.co.uk/rankings/ladder_2021_12.htm",
      },
      { text: " ranking. " },
    ],
  },
  {
    icon: "📍",
    date: "may '21",
    parts: [{ text: "Moved to NYC. " }],
  },
  {
    icon: "💼",
    date: "feb '21",
    parts: [
      { text: "Started full-time at Jane Street. Built client facing " },
      {
        text: "trading platforms",
        href: "https://signalsandthreads.com/state-machine-replication-and-why-you-should-care/",
      },
      { text: ". " },
    ],
  },
  {
    icon: "🎓",
    date: "dec '20",
    parts: [
      { text: "Finished my " },
      {
        text: "thesis",
        href: "https://dspace.mit.edu/entities/publication/676acc5c-bc47-4a44-9b0b-3441c5e3d5b5",
      },
      { text: ". " },
    ],
  },
  {
    icon: "🌱",
    date: "jun '20",
    parts: [
      { text: "Interned at Jane Street on the market data team. Won " },
      { text: "E", bold: true },
      { text: "lectronic " },
      { text: "T", bold: true },
      { text: "rading " },
      { text: "C", bold: true },
      { text: "ompetition. " },
    ],
  },
  {
    icon: "🤖",
    date: "jan '20",
    parts: [
      { text: "Taught a mini robotics class in St. Petersburg, Russia. " },
    ],
  },
  {
    icon: "🧩",
    date: "sep '19",
    parts: [
      { text: "Built the " },
      {
        text: "Hackrostic",
        href: "https://vey.ie/HackMIT2019-Puzzle3.html",
      },
      { text: " HackMIT entry puzzle with a friend. " },
    ],
  },
  {
    icon: "🌱",
    date: "jun '19",
    parts: [
      { text: "Interned at " },
      {
        text: "Rockset (acq by OpenAI)",
        href: "https://openai.com/index/openai-acquires-rockset/",
      },
      { text: ", worked on the query engine and ingest. " },
    ],
  },
  {
    icon: "📚",
    date: "feb '19",
    parts: [
      { text: "Started TAing for " },
      {
        text: "Intro to Algorithms",
        href: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
      },
      {
        text: ". Gave recitation, office hours, created problems, graded exams. ",
      },
    ],
  },
  {
    icon: "🌱",
    date: "jun '18",
    parts: [{ text: "Interned at Stripe on the storage team. " }],
  },
  {
    icon: "🌱",
    date: "jun '17",
    parts: [
      { text: "Interned at Fidelity Investments on the cybersecurity team. " },
    ],
  },
  {
    icon: "🎓",
    date: "sep '16",
    parts: [{ text: "Started at MIT. " }],
  },
  {
    icon: "🎓",
    date: "jun '16",
    parts: [
      { text: "Graduated from Nashua High School South. Ranked #2. " },
    ],
  },
];
