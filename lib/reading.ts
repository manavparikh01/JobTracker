// The 8-week commute learning list, transcribed from
// commute_learning_list_v2_merged.md. This is the source of truth for the
// reading page; only per-item check-state + notes live in the DB
// (ReadingProgress). To change the list, edit this file.

export type ReadingKind = "video" | "article" | "course";

export type ReadingItem = {
  id: string; // stable slug — do NOT change once shipped (keys DB progress)
  title: string;
  url?: string;
  kind: ReadingKind;
  month: 1 | 2;
  week: number;
  day: "Tue" | "Wed" | "Thu";
  core: boolean;
  note?: string;
};

export const WEEK_TITLES: Record<number, string> = {
  1: "Mental model + system design basics",
  2: "RAG on your actual stack (Azure)",
  3: "Retrieval depth (rerankers) + the practitioner bible",
  4: "Prompting + evals (your differentiator)",
  5: "Agents without the hype",
  6: "Agent runtime: tools, memory, human approval",
  7: "AI product engineering + observability",
  8: "Interview-level AI system design (the capstone)",
};

export const READING_ITEMS: ReadingItem[] = [
  // --- Month 1 ---
  {
    id: "w1-system-design-primer",
    title: "System Design Primer — scalability, CAP, caching, load balancing, replication, partitioning (skim, don't memorize)",
    url: "https://github.com/donnemartin/system-design-primer",
    kind: "article",
    month: 1, week: 1, day: "Tue", core: true,
  },
  {
    id: "w1-karpathy-intro-llms",
    title: "Karpathy — [1hr Talk] Intro to Large Language Models",
    url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
    kind: "video",
    month: 1, week: 1, day: "Wed", core: true,
    note: "The single best mental model + vocabulary.",
  },
  {
    id: "w1-eugene-yan-patterns-start",
    title: "Eugene Yan — Patterns for Building LLM-based Systems & Products (start; spans wk 1–2)",
    url: "https://eugeneyan.com/writing/llm-patterns/",
    kind: "article",
    month: 1, week: 1, day: "Thu", core: true,
    note: "The backbone read. Then send 2 networking messages.",
  },
  {
    id: "w2-bytebytego-scaling",
    title: "ByteByteGo — Scale From Zero To Millions of Users / scaling basics",
    url: "https://www.youtube.com/@ByteByteGo",
    kind: "video",
    month: 1, week: 2, day: "Tue", core: true,
  },
  {
    id: "w2-azure-rag-overview",
    title: "Microsoft Learn — RAG in Azure AI Search",
    url: "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
    kind: "article",
    month: 1, week: 2, day: "Wed", core: true,
    note: "This is literally your resume. Own hybrid search, RRF, BM25 + HNSW, semantic ranking.",
  },
  {
    id: "w2-azure-hybrid-search",
    title: "Microsoft Learn — Hybrid search overview",
    url: "https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview",
    kind: "article",
    month: 1, week: 2, day: "Wed", core: true,
  },
  {
    id: "w2-eugene-yan-patterns-finish",
    title: "Eugene Yan — Patterns post (finish it)",
    url: "https://eugeneyan.com/writing/llm-patterns/",
    kind: "article",
    month: 1, week: 2, day: "Thu", core: true,
    note: "2 networking messages.",
  },
  {
    id: "w3-bytebytego-search-design",
    title: "ByteByteGo — Design a search / autocomplete system walkthrough",
    url: "https://www.youtube.com/@ByteByteGo",
    kind: "video",
    month: 1, week: 3, day: "Tue", core: true,
    note: "Your work is search + AI + UX.",
  },
  {
    id: "w3-pinecone-rerankers",
    title: "Pinecone — Rerankers and Two-Stage Retrieval",
    url: "https://www.pinecone.io/learn/series/rag/rerankers/",
    kind: "article",
    month: 1, week: 3, day: "Wed", core: true,
    note: "The move that makes you sound senior in RAG interviews.",
  },
  {
    id: "w3-ms-rag-techniques",
    title: "Microsoft Cloud blog — Common RAG techniques explained",
    url: "https://www.microsoft.com/en-us/microsoft-cloud/blog/2025/02/04/common-retrieval-augmented-generation-rag-techniques-explained/",
    kind: "article",
    month: 1, week: 3, day: "Wed", core: false,
    note: "Optional companion: chunking, hybrid, query rewriting, reranking in one page.",
  },
  {
    id: "w3-applied-llms-part1",
    title: "Applied LLMs — What We Learned from a Year of Building with LLMs, Part I (Tactical)",
    url: "https://applied-llms.org/",
    kind: "article",
    month: 1, week: 3, day: "Thu", core: true,
    note: "2 networking messages.",
  },
  {
    id: "w4-anthropic-prompt-eng",
    title: "Anthropic — Prompt engineering docs (read as a production builder)",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
    kind: "article",
    month: 1, week: 4, day: "Wed", core: true,
    note: "Structured outputs, clear instructions, failure handling.",
  },
  {
    id: "w4-hamel-evals",
    title: "Hamel Husain — Your AI Product Needs Evals",
    url: "https://hamel.dev/blog/posts/evals/",
    kind: "article",
    month: 1, week: 4, day: "Thu", core: true,
    note: "The canonical evals essay. Dense — give it both Thursday legs. 2 networking messages.",
  },

  // --- Month 2 ---
  {
    id: "w5-azure-agentic-retrieval",
    title: "Azure AI Search — Agentic Retrieval overview",
    url: "https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-overview",
    kind: "article",
    month: 2, week: 5, day: "Tue", core: true,
    note: "Bridges your RAG work into agents. High resume leverage.",
  },
  {
    id: "w5-anthropic-effective-agents",
    title: "Anthropic — Building Effective Agents",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    kind: "article",
    month: 2, week: 5, day: "Wed", core: true,
    note: "Workflows vs agents + the 5 patterns. The reference everyone cites.",
  },
  {
    id: "w5-lilian-weng-agents",
    title: "Lilian Weng — LLM Powered Autonomous Agents",
    url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
    kind: "article",
    month: 2, week: 5, day: "Thu", core: true,
    note: "Foundational: planning, memory, tools. Split across the ride. 2 networking messages.",
  },
  {
    id: "w6-bytebytego-design-youtube",
    title: "ByteByteGo — Design YouTube",
    url: "https://www.youtube.com/@ByteByteGo",
    kind: "video",
    month: 2, week: 6, day: "Tue", core: true,
    note: "Maps to transcoding, blob storage, CDN, queues.",
  },
  {
    id: "w6-dlai-langgraph",
    title: "DeepLearning.AI — AI Agents in LangGraph (short course)",
    url: "https://www.deeplearning.ai/short-courses/",
    kind: "course",
    month: 2, week: 6, day: "Wed", core: true,
    note: "Pick this OR Building Agentic RAG with LlamaIndex. Video lessons work well on a train.",
  },
  {
    id: "w6-guardrails-hitl",
    title: "OpenAI Agents SDK Guardrails + LangChain Human-in-the-loop (skim for vocabulary)",
    kind: "article",
    month: 2, week: 6, day: "Thu", core: false,
    note: "Optional, desk-ish. Reference docs — keep it light. 2 networking messages.",
  },
  {
    id: "w7-ai-engineer-worlds-fair",
    title: "AI Engineer World's Fair 2025 — pick 2–3 talks (evals, agent reliability, RAG, MCP)",
    kind: "video",
    month: 2, week: 7, day: "Wed", core: true,
    note: "Search the \"AI Engineer\" channel on YouTube. Curated, not a rabbit hole.",
  },
  {
    id: "w7-applied-llms-part2",
    title: "Applied LLMs — What We Learned… Part II (Operational)",
    url: "https://applied-llms.org/",
    kind: "article",
    month: 2, week: 7, day: "Thu", core: true,
    note: "Ties straight to your Langfuse/observability work. 2 networking messages.",
  },
  {
    id: "w8-kleppmann-lectures",
    title: "Martin Kleppmann — distributed systems lectures (intro, replication, partitioning, consistency ONLY)",
    kind: "video",
    month: 2, week: 8, day: "Tue", core: false,
    note: "Optional. Do not binge all 6 hours.",
  },
  {
    id: "w8-eugene-yan-reread",
    title: "Re-read Eugene Yan patterns + practice \"design a RAG system + how I'd evaluate it\" out loud",
    url: "https://eugeneyan.com/writing/llm-patterns/",
    kind: "article",
    month: 2, week: 8, day: "Wed", core: true,
    note: "Now that the pieces click.",
  },
  {
    id: "w8-bytebytego-design-videos",
    title: "ByteByteGo — pick 3–4 design videos (object storage / Google Drive ties to your doc + blob work)",
    url: "https://www.youtube.com/@ByteByteGo",
    kind: "video",
    month: 2, week: 8, day: "Thu", core: true,
    note: "2 networking messages.",
  },
];
