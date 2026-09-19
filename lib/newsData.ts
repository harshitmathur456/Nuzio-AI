import { Article } from './types';

// Curated wire feed fixture tailored for Indian professionals
// Each body is long enough to narrate 35-50 seconds (~85-115 words)
export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-01',
    category: 'AI & Tech',
    headline: 'Anthropic ships Claude 4.5 with 2M-token memory and native tools',
    standfirst: 'Anthropic memory layer lets Claude hold entire enterprise codebases in persistent active reasoning.',
    body: 'Anthropic has officially rolled out Claude 4.5, introducing a breakthrough two-million-token context window alongside native developer execution capabilities. The architecture allows engineering teams across Bengaluru, Hyderabad, and Silicon Valley to mount complete multi-repository codebases into persistent memory, eliminating repetitive context-loading overhead. Benchmarks show a forty percent reduction in hallucination rates on complex architectural refactoring, marking a notable milestone in enterprise autonomous coding agents.',
    source: 'THE VERGE',
    sourceUrl: 'https://theverge.com',
    publishedAt: new Date(Date.now() - 1.2 * 3600 * 1000).toISOString(), // 1.2h ago
    durationSec: 42,
  },
  {
    id: 'art-02',
    category: 'Markets',
    headline: 'RBI holds repo rate at 6.5% as retail inflation drops to four-year low',
    standfirst: 'Monetary Policy Committee votes unanimously to maintain stance amid accelerating capital expenditures.',
    body: 'The Reserve Bank of India’s Monetary Policy Committee has voted unanimously to keep the benchmark repo rate unchanged at 6.5 percent for the eighth consecutive session. Governor Shaktikanta Das highlighted that headline inflation has cooled toward the central bank’s medium-term four percent target, supported by robust Kharif harvest arrivals. With real gross domestic product growth projected at 7.2 percent for fiscal 2027, the central bank maintains adequate policy headroom while ensuring domestic market liquidity remains firmly balanced.',
    source: 'BLOOMBERG',
    sourceUrl: 'https://bloomberg.com',
    publishedAt: new Date(Date.now() - 2.1 * 3600 * 1000).toISOString(), // 2.1h ago
    durationSec: 45,
  },
  {
    id: 'art-03',
    category: 'Startups',
    headline: 'Zepto closes $350M round led by domestic family offices at $5B valuation',
    standfirst: 'Quick commerce champion accelerates reverse flip to India ahead of domestic IPO on Dalal Street.',
    body: 'Quick commerce platform Zepto has completed a 350-million-dollar financing round anchored predominantly by Indian domestic family offices and sovereign investment vehicles. The fundraise elevates the Mumbai-based unicorn’s post-money valuation past five billion dollars as it accelerates corporate redomiciliation back to India. Operating cash flows have turned positive across its top forty dark stores, paving the way for a landmark listing on the National Stock Exchange early next year.',
    source: 'TECHCRUNCH',
    sourceUrl: 'https://techcrunch.com',
    publishedAt: new Date(Date.now() - 3.4 * 3600 * 1000).toISOString(), // 3.4h ago
    durationSec: 39,
  },
  {
    id: 'art-04',
    category: 'Global',
    headline: 'Federal Reserve minutes indicate growing consensus for gradual rate easing',
    standfirst: 'FOMC policymakers point to balanced employment risks and steady disinflation across housing sectors.',
    body: 'Detailed minutes from the Federal Open Market Committee’s latest meeting signal that policymakers are preparing a calibrated easing cycle as inflationary pressures across services and housing recede. Committee participants noted that the balance of risks to employment and price stability has shifted favorably, reducing concerns of economic overheating. Global currency markets reacted with steady gains across emerging market sovereign debt, with Indian government bonds attracting sustained foreign portfolio inflows.',
    source: 'FINANCIAL TIMES',
    sourceUrl: 'https://ft.com',
    publishedAt: new Date(Date.now() - 4.2 * 3600 * 1000).toISOString(), // 4.2h ago
    durationSec: 43,
  },
  {
    id: 'art-05',
    category: 'Science',
    headline: 'ISRO finalizes timeline for Chandrayaan-4 sample return and space station core module',
    standfirst: 'Indian space agency completes critical docking simulations in Bengaluru for orbital laboratory module.',
    body: 'The Indian Space Research Organisation has approved the complete engineering specifications for the Chandrayaan-4 lunar sample return mission. Ground controllers at the ISRO Telemetry Tracking and Command Network successfully validated autonomous orbital rendezvous algorithms in simulated lunar descent trajectories. Simultaneously, structural fabrication of the inaugural Bharatiya Antariksh Station module has commenced, with maiden low-Earth orbit deployment targeted for late 2028.',
    source: 'REUTERS',
    sourceUrl: 'https://reuters.com',
    publishedAt: new Date(Date.now() - 5.5 * 3600 * 1000).toISOString(), // 5.5h ago
    durationSec: 44,
  },
  {
    id: 'art-06',
    category: 'AI & Tech',
    headline: 'Tata Communications and Nvidia roll out 16,000 GPU AI supercomputing cluster across India',
    standfirst: 'Sovereign computing infrastructure goes live to accelerate Indic foundation language models.',
    body: 'Tata Communications in partnership with Nvidia has commissioned a massive sixteen-thousand GPU artificial intelligence supercluster distributed across data centers in Navi Mumbai and Hyderabad. Equipped with Grace Hopper superchips, the infrastructure offers sovereign computing to Indian research institutions, defense organizations, and tech enterprises. Several homegrown language models trained on twenty-two scheduled Indian languages are already running pilot inference workloads on the cluster.',
    source: 'ECONOMIC TIMES',
    sourceUrl: 'https://economictimes.indiatimes.com',
    publishedAt: new Date(Date.now() - 6.8 * 3600 * 1000).toISOString(), // 6.8h ago
    durationSec: 46,
  },
  {
    id: 'art-07',
    category: 'Markets',
    headline: 'Nifty 50 surges to fresh high as monthly domestic SIP inflows touch ₹26,000 crore',
    standfirst: 'Heavyweight financial, semiconductor, and capex equities drive sustained benchmark index momentum.',
    body: 'Indian equity benchmarks touched unprecedented records today, powered by relentless retail investor participation through systematic investment plans now exceeding twenty-six thousand crore rupees each month. Institutional desks noted broad-based sector participation spanning private lenders, capital goods suppliers, and renewable power infrastructure developers. Market breadth remained decisively positive with midcap indices recording over two gainers for every declining issue.',
    source: 'MINT',
    sourceUrl: 'https://livemint.com',
    publishedAt: new Date(Date.now() - 8.0 * 3600 * 1000).toISOString(), // 8.0h ago
    durationSec: 38,
  },
  {
    id: 'art-08',
    category: 'Startups',
    headline: 'Peak XV launches $25M frontier tech incubator for Indian robotics and space founders',
    standfirst: 'Venture fund targets hardware prototypes, satellite propulsion, and precision industrial automation.',
    body: 'Venture capital firm Peak XV Partners has committed twenty-five million dollars to an incubator dedicated to hardware, aerospace propulsion, and robotics startups founded in India. The initiative will grant participating teams up to five hundred thousand dollars in non-dilutive prototype capital alongside direct access to defense test corridors and high-vacuum thermal chambers. The first cohort features eight startups developing autonomous agricultural drones and small-satellite laser communications.',
    source: 'INC42',
    sourceUrl: 'https://inc42.com',
    publishedAt: new Date(Date.now() - 9.4 * 3600 * 1000).toISOString(), // 9.4h ago
    durationSec: 41,
  },
];
