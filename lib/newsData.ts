import { Article } from './types';

// Curated high-fidelity wire feed fixture tailored for Indian professionals
export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-01',
    category: 'AI & Tech',
    headline: 'Anthropic ships Claude 4.5 with 2M-token memory and native developer tools.',
    summary: 'Anthropic’s new memory architecture lets Claude retain persistent codebase context across weeks of engineering sprints.',
    narrationText: 'Anthropic has officially launched Claude 4.5, bringing a breakthrough two million token memory window and native developer tooling. The update allows engineers to mount full multi-repo codebases directly into the reasoning context, radically cutting context switching for engineering teams in Bengaluru and San Francisco.',
    source: 'THE VERGE',
    sourceUrl: 'https://theverge.com',
    readTimeMins: 3,
    // Published 1.5 hours ago
    publishedAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
    accentGradient: ['#7b70d8', '#4c8dff'],
  },
  {
    id: 'art-02',
    category: 'Markets',
    headline: 'RBI holds repo rate at 6.5% as retail inflation eases to four-year low.',
    summary: 'Governor Shaktikanta Das notes resilient urban consumption and private capex pick-up as MPC unanimously maintains stance.',
    narrationText: 'The Reserve Bank of India’s Monetary Policy Committee has voted unanimously to keep the benchmark repo rate unchanged at 6.5 percent for the eighth consecutive review. Governor Shaktikanta Das emphasized that cooling headline inflation coupled with healthy Kharif sowing positions India for stable 7.2 percent growth this fiscal year.',
    source: 'BLOOMBERG',
    sourceUrl: 'https://bloomberg.com',
    readTimeMins: 2,
    // Published 2.2 hours ago
    publishedAt: new Date(Date.now() - 2.2 * 3600 * 1000).toISOString(),
    accentGradient: ['#3ecf8e', '#4c8dff'],
  },
  {
    id: 'art-03',
    category: 'Startups',
    headline: 'Zepto closes $350M round led by domestic Indian family offices at $5B valuation.',
    summary: 'Quick commerce champion accelerates reverse flip to India ahead of planned domestic IPO in Mumbai.',
    narrationText: 'Mumbai-based quick commerce sensation Zepto has finalized a 350 million dollar financing round anchored entirely by prominent Indian family offices and wealth funds. With valuation crossing five billion dollars, the company is accelerating its domestic relocation to list on the National Stock Exchange early next year.',
    source: 'TECHCRUNCH',
    sourceUrl: 'https://techcrunch.com',
    readTimeMins: 3,
    // Published 3.8 hours ago
    publishedAt: new Date(Date.now() - 3.8 * 3600 * 1000).toISOString(),
    accentGradient: ['#6a4cf7', '#9080ff'],
  },
  {
    id: 'art-04',
    category: 'Global',
    headline: 'Federal Reserve minutes indicate growing consensus for systematic rate easing.',
    summary: 'FOMC policymakers point to balanced employment risks and steady disinflation across housing and services.',
    narrationText: 'Detailed minutes released from the latest Federal Open Market Committee meeting show policymakers see upside inflation risks moderating steadily. A broad majority of voting members signaled that calibrated interest rate adjustments will be appropriate to preserve momentum in global labor markets.',
    source: 'FINANCIAL TIMES',
    sourceUrl: 'https://ft.com',
    readTimeMins: 2,
    // Published 4.5 hours ago
    publishedAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
    accentGradient: ['#38d9f0', '#3ecf8e'],
  },
  {
    id: 'art-05',
    category: 'Science',
    headline: 'ISRO unveils timeline for Chandrayaan-4 lunar sample return and Bharatiya Antariksh Station.',
    summary: 'Indian space agency completes critical docking simulations in Bengaluru for modular space station module 1.',
    narrationText: 'The Indian Space Research Organisation has unveiled its comprehensive blueprint for Chandrayaan-4, designed to harvest lunar surface samples and perform automated return docking. ISRO chief S. Somanath confirmed that fabrication of the inaugural Bharatiya Antariksh Station core module is tracking ahead of schedule.',
    source: 'REUTERS',
    sourceUrl: 'https://reuters.com',
    readTimeMins: 4,
    // Published 6.0 hours ago
    publishedAt: new Date(Date.now() - 6.0 * 3600 * 1000).toISOString(),
    accentGradient: ['#4c8dff', '#7b70d8'],
  },
  {
    id: 'art-06',
    category: 'AI & Tech',
    headline: 'Nvidia and Tata Communications deploy massive sovereign AI cloud across India.',
    summary: 'Over 16,000 GH200 Grace Hopper superchips go live to power Indic foundational language models.',
    narrationText: 'Nvidia and Tata Communications have jointly commissioned one of Asia’s largest sovereign AI computing clusters, deploying sixteen thousand Grace Hopper superchips across Tier 4 data centers in Mumbai and Hyderabad. The infrastructure will accelerate custom LLMs trained on twenty-two scheduled Indian languages.',
    source: 'ECONOMIC TIMES',
    sourceUrl: 'https://economictimes.indiatimes.com',
    readTimeMins: 3,
    // Published 7.2 hours ago
    publishedAt: new Date(Date.now() - 7.2 * 3600 * 1000).toISOString(),
    accentGradient: ['#6a4cf7', '#3ecf8e'],
  },
  {
    id: 'art-07',
    category: 'Markets',
    headline: 'Nifty 50 registers fresh historic high as foreign institutional inflows surge past $2B.',
    summary: 'Heavyweight financial, capital goods, and semiconductor stocks drive benchmark index higher.',
    narrationText: 'Indian equity markets extended their record-breaking rally this morning, with the Nifty 50 leaping past previous all-time highs. Robust domestic mutual fund SIP flows surpassing twenty-five thousand crore rupees monthly continue to provide unprecedented cushion against global market volatility.',
    source: 'MINT',
    sourceUrl: 'https://livemint.com',
    readTimeMins: 2,
    // Published 8.5 hours ago
    publishedAt: new Date(Date.now() - 8.5 * 3600 * 1000).toISOString(),
    accentGradient: ['#38d9f0', '#4c8dff'],
  },
  {
    id: 'art-08',
    category: 'Startups',
    headline: 'Peak XV launches $25M frontier tech incubator for Indian robotics and space startups.',
    summary: 'Venture firm targets hardware, autonomous robotics, and satellite propulsion founders with deep tech grants.',
    narrationText: 'Venture capital powerhouse Peak XV Partners has committed twenty-five million dollars to a specialized incubation fund targeting Indian hardware founders. The program provides non-dilutive prototype grants, advanced wind-tunnel test facilities, and rapid access to aerospace certified supply chains.',
    source: 'INC42',
    sourceUrl: 'https://inc42.com',
    readTimeMins: 2,
    // Published 9.1 hours ago
    publishedAt: new Date(Date.now() - 9.1 * 3600 * 1000).toISOString(),
    accentGradient: ['#7b70d8', '#38d9f0'],
  },
];
