import { ArrowIcon } from "@/components/ui/section";
import type { WorkVisual as Visual } from "@/lib/types";
import { WorkCardFrame } from "./work-card-frame";

const BACKGROUNDS: Record<Visual, string> = {
  search: "from-[#04283f] via-[#063b5c] to-[#031722]",
  chat: "from-[#0a3b22] via-[#0d5230] to-[#04200f]",
  pipeline: "from-[#2a0f4a] via-[#3b1569] to-[#120622]",
  mobile: "from-[#062f33] via-[#0a4347] to-[#031b1e]",
};

/** Illustrative only: shows the shape of the work, with no invented data or metrics. */
function SearchMock() {
  return (
    <div className="rounded-t-xl bg-gradient-to-b from-sky-100 to-white p-6 text-neutral-900 sm:p-8">
      <div className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-500">
        <span aria-hidden="true">⌕</span> Semantic query
      </div>
      <p className="mt-7 text-center font-display text-2xl font-medium tracking-tight sm:text-3xl">
        Retrieve, rank, respond
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
        {["Embed", "Hybrid search", "LLM answer"].map((step) => (
          <div key={step} className="rounded-lg border border-neutral-200 bg-white px-2 py-5 shadow-sm">
            {step}
          </div>
        ))}
      </div>
      <div className="mt-5 space-y-2" aria-hidden="true">
        {[92, 78, 64].map((width) => (
          <div key={width} className="h-2.5 rounded-full bg-sky-200" style={{ width: `${width}%` }} />
        ))}
      </div>
    </div>
  );
}

function ChatMock() {
  const bubble = "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm";
  return (
    <div className="rounded-t-xl bg-white p-6 text-neutral-900 sm:p-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 text-xs text-neutral-500">
        <span className="font-medium text-neutral-900">AI agent</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Streaming
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <div className={`${bubble} self-end bg-neutral-900 text-white`}>Continue from my last request</div>
        <div className={`${bubble} self-start bg-neutral-100`}>Context restored from memory.</div>
        <div className="flex gap-2 self-start text-xs">
          <span className="rounded-md border border-emerald-300 bg-emerald-50 px-2 py-1 text-emerald-800">Tool call</span>
          <span className="rounded-md border border-neutral-200 px-2 py-1">External API</span>
        </div>
        <div className={`${bubble} self-start bg-neutral-100`}>
          Streaming the response<span className="ml-1 inline-block h-3 w-1.5 bg-neutral-900 align-middle" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

function PipelineMock() {
  const nodes = ["Dynamics 365", "n8n", "Claude", "Jira", "Datadog", "Marketing"];
  return (
    <div className="rounded-t-xl bg-[#17161d] p-6 text-white sm:p-8" style={{ backgroundImage: "radial-gradient(#ffffff1f 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
      <p className="text-xs uppercase tracking-widest text-white/60">Automation pipeline</p>
      <div className="mt-6 grid grid-cols-3 gap-x-6 gap-y-8">
        {nodes.map((node, index) => (
          <div key={node} className="relative rounded-lg border border-white/20 bg-white/10 px-2 py-4 text-center text-xs">
            {node}
            {index % 3 !== 2 && (
              <span aria-hidden="true" className="absolute left-full top-1/2 h-px w-6 bg-fuchsia-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileMock() {
  const phone = "rounded-t-[2rem] border-[5px] border-b-0 border-neutral-800 bg-white text-neutral-900";
  return (
    <div className="flex items-end justify-center px-4">
      <div className={`${phone} hidden h-52 w-36 -rotate-6 translate-x-6 p-3 pt-8 text-xs sm:block`}>
        <p className="font-semibold">iOS</p>
        <div className="mt-3 h-16 rounded-lg bg-teal-100" aria-hidden="true" />
      </div>
      <div className={`${phone} relative z-10 h-72 w-48 p-4 pt-8`}>
        <span className="absolute left-1/2 top-2 h-3.5 w-14 -translate-x-1/2 rounded-full bg-neutral-900" aria-hidden="true" />
        <p className="text-sm font-semibold">Shared codebase</p>
        <div className="mt-3 flex items-center justify-center rounded-xl bg-teal-50 py-6 font-mono text-xs">strict: true</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg border border-neutral-200 py-3">iOS</div>
          <div className="rounded-lg border border-neutral-200 py-3">Android</div>
        </div>
      </div>
      <div className={`${phone} hidden h-52 w-36 rotate-6 -translate-x-6 p-3 pt-8 text-xs sm:block`}>
        <p className="font-semibold">Android</p>
        <div className="mt-3 h-16 rounded-lg bg-teal-100" aria-hidden="true" />
      </div>
    </div>
  );
}

const MOCKS: Record<Visual, () => React.JSX.Element> = {
  search: SearchMock,
  chat: ChatMock,
  pipeline: PipelineMock,
  mobile: MobileMock,
};

/** The second panel that swings in on hover: a summary of the same work. */
function OverlayPanel({ title, tech }: { title: string; tech: string[] }) {
  return (
    <div className="work-layer-over pointer-events-none absolute bottom-0 right-4 w-[65%] rounded-t-xl border-4 border-white/5 bg-white p-5 text-neutral-900 shadow-2xl">
      <p className="font-display text-lg font-medium leading-tight tracking-tight">{title}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        {tech.map((item) => (
          <li key={item} className="rounded-md border border-neutral-200 px-2 py-1">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-2" aria-hidden="true">
        <div className="h-2 w-11/12 rounded-full bg-neutral-200" />
        <div className="h-2 w-3/4 rounded-full bg-neutral-200" />
        <div className="h-2 w-1/2 rounded-full bg-neutral-200" />
      </div>
    </div>
  );
}

type Props = { visual: Visual; lead: string; title: string; tech: string[]; href?: string };

export function WorkVisual({ visual, lead, title, tech, href }: Props) {
  const Mock = MOCKS[visual] ?? SearchMock;

  return (
    <WorkCardFrame href={href} className="rounded-3xl border border-border bg-surface p-2">
      <div className={`flex h-full min-h-[440px] flex-col overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${BACKGROUNDS[visual] ?? BACKGROUNDS.search}`}>
        <div className="flex items-start justify-between gap-6 p-7 sm:p-10">
          <p className="text-xl leading-snug text-white/75 sm:text-2xl">{lead}</p>
          <span className="mt-1 shrink-0 text-white/80">
            <ArrowIcon className="size-6" />
          </span>
        </div>
        <div className="relative mt-auto px-7 sm:px-12">
          <div className="work-layer-main origin-bottom">
            <Mock />
          </div>
          <OverlayPanel title={title} tech={tech} />
        </div>
      </div>
    </WorkCardFrame>
  );
}
