import { links, timelineEntries } from "./site-data.js";

const state = {
  filter: "all",
  selectedIndex: -1,
  scrollGuardUntil: 0,
  scrollRaf: 0,
};

const timelineEntriesElement = document.getElementById("timelineEntries");
const timelineMarker = document.getElementById("timelineMarker");
const timelineLine = document.getElementById("timelineLine");
const timelineFilterButtons = [...document.querySelectorAll("[data-timeline-filter]")];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getAllEntryElements() {
  return [...timelineEntriesElement.querySelectorAll(".timeline-entry")];
}

function getEntryElements() {
  return getAllEntryElements().filter((entry) => !entry.hidden);
}

function setFooterLinks() {
  const emailLink = document.getElementById("emailLink");
  const githubLink = document.getElementById("githubLink");
  const linkedinLink = document.getElementById("linkedinLink");

  emailLink.href = links.email;
  githubLink.href = links.github;
  linkedinLink.href = links.linkedin;

  for (const link of [githubLink, linkedinLink]) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
}

function setWritingExpanded(toggle, panel, expanded) {
  toggle.setAttribute("aria-expanded", String(expanded));
  panel.hidden = !expanded;
  updateMarker();
}

function appendEntryPart(parent, part, writingPanel) {
  const node = document.createElement(part.writingToggle ? "button" : part.href ? "a" : "span");
  node.textContent = part.text;

  if (part.emphasis) {
    node.classList.add("entry-emphasis");
  }

  if (part.bold) {
    node.classList.add("entry-bold");
  }

  if (part.href) {
    node.href = part.href;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
    node.classList.add("entry-link");
  }

  if (part.writingToggle) {
    node.type = "button";
    node.classList.add("entry-link", "writing-toggle");
    node.setAttribute("aria-controls", writingPanel.id);
    node.setAttribute("aria-expanded", "false");
    node.addEventListener("click", () => {
      const titleTop = node.getBoundingClientRect().top;
      const expanded = node.getAttribute("aria-expanded") === "true";
      setWritingExpanded(node, writingPanel, !expanded);

      const restoreTitlePosition = () => {
        window.scrollBy(0, node.getBoundingClientRect().top - titleTop);
      };
      restoreTitlePosition();
      requestAnimationFrame(restoreTitlePosition);
    });

    writingPanel.querySelector(".writing-collapse").addEventListener("click", () => {
      setWritingExpanded(node, writingPanel, false);
      node.focus();
    });
  }

  parent.append(node);
}

function renderWritingContent(writing, index) {
  const panel = document.createElement("div");
  panel.id = `writing-${index}`;
  panel.className = "inline-writing";
  panel.hidden = true;
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", writing.title);

  for (const block of writing.blocks) {
    if (block.type === "principle") {
      const principle = document.createElement("p");
      principle.className = "inline-writing-principle";
      principle.textContent = block.text;
      panel.append(principle);
      continue;
    }

    const section = document.createElement("section");
    const heading = document.createElement("h2");
    heading.textContent = `Case study: ${block.title}`;
    section.append(heading);

    for (const text of block.paragraphs) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      section.append(paragraph);
    }

    panel.append(section);
  }

  const collapse = document.createElement("button");
  collapse.className = "writing-collapse";
  collapse.type = "button";
  collapse.textContent = "collapse ↑";
  panel.append(collapse);

  return panel;
}

function renderTimeline() {
  const fragment = document.createDocumentFragment();

  timelineEntries.forEach((entry, index) => {
    const row = document.createElement("article");
    row.className = "timeline-entry";
    row.dataset.category = entry.category ?? "timeline";
    row.dataset.entry = String(index);

    const icon = document.createElement("span");
    icon.className = "timeline-icon";
    icon.textContent = entry.icon;
    icon.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "timeline-entry-content";
    const writingPanel = entry.writing ? renderWritingContent(entry.writing, index) : null;

    const text = document.createElement("p");
    for (const part of entry.parts) {
      appendEntryPart(text, part, writingPanel);
    }
    text.append(" ");

    const date = document.createElement("time");
    date.className = "timeline-date";
    date.textContent = entry.date;
    text.append(date);

    content.append(text);
    if (writingPanel) {
      content.append(writingPanel);
    }

    row.append(icon, content);
    fragment.append(row);
  });

  timelineEntriesElement.append(fragment);
}

function updateMarker() {
  const entries = getEntryElements();
  const selectedEntry = entries[state.selectedIndex];

  if (!selectedEntry) {
    timelineMarker.classList.remove("is-visible");
    timelineLine.style.height = "0";
    return;
  }

  const markerY = selectedEntry.offsetTop;
  timelineMarker.style.transform = `translateY(${markerY}px)`;
  timelineMarker.classList.add("is-visible");
  timelineLine.style.height = `${Math.max(0, markerY + 4)}px`;
}

function updateSelection() {
  const selectedEntry = getEntryElements()[state.selectedIndex];

  getAllEntryElements().forEach((entry) => {
    const selected = entry === selectedEntry;
    entry.classList.toggle("is-selected", selected);
    if (selected) {
      entry.setAttribute("aria-current", "true");
    } else {
      entry.removeAttribute("aria-current");
    }
  });
}

function maybeScrollEntryIntoView(entry) {
  const rect = entry.getBoundingClientRect();

  if (rect.top < 90) {
    state.scrollGuardUntil = Date.now() + 900;
    window.scrollBy({ top: rect.top - 160, behavior: "smooth" });
  } else if (rect.bottom > window.innerHeight - 90) {
    state.scrollGuardUntil = Date.now() + 900;
    window.scrollBy({
      top: rect.bottom - window.innerHeight + 160,
      behavior: "smooth",
    });
  }
}

function setSelectedIndex(index, source = "keyboard") {
  const entries = getEntryElements();
  state.selectedIndex = clamp(index, -1, entries.length - 1);
  updateSelection();
  updateMarker();

  if (state.selectedIndex < 0 || source === "scroll") {
    return;
  }

  const entry = entries[state.selectedIndex];
  if (entry) {
    maybeScrollEntryIntoView(entry);
  }
}

function setTimelineFilter(filter) {
  state.filter = filter;

  for (const button of timelineFilterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.timelineFilter === filter));
  }

  for (const entry of getAllEntryElements()) {
    entry.hidden = filter !== "all" && entry.dataset.category !== filter;
  }

  state.selectedIndex = -1;
  updateSelection();
  updateMarker();

  if (getEntryElements().length) {
    setSelectedIndex(0);
  }
}

function focusFromScroll() {
  if (Date.now() < state.scrollGuardUntil) return;

  const entries = getEntryElements();
  if (!entries.length) return;

  const referenceY = window.scrollY + window.innerHeight * 0.38;
  let bestIndex = 0;
  let bestDistance = Infinity;

  entries.forEach((entry, index) => {
    const entryY = entry.getBoundingClientRect().top + window.scrollY;
    const distance = Math.abs(entryY - referenceY);
    if (distance < bestDistance) {
      bestIndex = index;
      bestDistance = distance;
    }
  });

  if (bestIndex !== state.selectedIndex) {
    setSelectedIndex(bestIndex, "scroll");
  }
}

function onScroll() {
  if (state.scrollRaf) return;

  state.scrollRaf = requestAnimationFrame(() => {
    state.scrollRaf = 0;
    focusFromScroll();
  });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (observedEntries) => {
      observedEntries.forEach((observedEntry) => {
        if (!observedEntry.isIntersecting) return;
        observedEntry.target.classList.add("is-visible");
        observer.unobserve(observedEntry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  for (const entry of getEntryElements()) {
    if (entry.getBoundingClientRect().top <= window.innerHeight * 0.94) {
      continue;
    }

    entry.classList.add("reveal-entry");
    observer.observe(entry);
  }
}

function isTypingTarget(target) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target?.isContentEditable
  );
}

function handleKeyboardNavigation(event) {
  const key = event.key.toLowerCase();

  if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }

  if (key === "j" || event.key === "ArrowDown") {
    event.preventDefault();
    const nextIndex = state.selectedIndex < 0 ? 0 : state.selectedIndex + 1;
    setSelectedIndex(nextIndex);
  } else if (key === "k" || event.key === "ArrowUp") {
    event.preventDefault();
    const previousIndex = state.selectedIndex < 0 ? 0 : state.selectedIndex - 1;
    setSelectedIndex(previousIndex);
  } else if (event.key === "Escape") {
    setSelectedIndex(-1);
  }
}

function bindEvents() {
  document.addEventListener("keydown", handleKeyboardNavigation);
  for (const button of timelineFilterButtons) {
    button.addEventListener("click", () => setTimelineFilter(button.dataset.timelineFilter));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    updateMarker();
    onScroll();
  });
  window.addEventListener("load", updateMarker);
}

function initialize() {
  setFooterLinks();
  renderTimeline();
  bindEvents();
  focusFromScroll();
  setupReveal();
  setTimeout(focusFromScroll, 350);
}

initialize();
