"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const TABS = [
  {
    tag: "Retrieval",
    title: "RAG systems",
    body: "Vector databases that improve LLM response accuracy and reduce hallucinations.",
  },
  {
    tag: "Agents",
    title: "Tool-calling agents",
    body: "LangGraph agents with memory, keeping context across multi-turn interactions.",
  },
  {
    tag: "Automation",
    title: "Workflow pipelines",
    body: "n8n pipelines connecting Dynamics 365, Jira and Datadog with marketing platforms.",
  },
  {
    tag: "Delivery",
    title: "Streaming interfaces",
    body: "Real-time chat using Server-Sent Events and TypeScript React.",
  },
];

export function FoundationsTabs() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <div className="flex flex-col items-start md:items-end">
      <div role="tablist" aria-label="Focus areas" className="flex flex-wrap gap-2">
        {TABS.map((item, index) => (
          <button
            key={item.tag}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              index === active
                ? "border-fuchsia-300 text-fuchsia-700 dark:text-fuchsia-300"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {item.tag}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-7 min-h-24 max-w-64 md:text-right">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.tag}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-display text-xl font-semibold tracking-tight">{tab.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tab.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
