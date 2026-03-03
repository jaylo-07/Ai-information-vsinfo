require("dotenv").config();
const axios = require("axios");

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Call OpenAI API directly.
 */
async function callOpenAI(prompt, maxTokens = 2000) {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not set in .env");

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Cost-effective model for generating questions and reports
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.3,
    });

    return response.choices[0].message.content || "";
}

/**
 * SerpAPI — organic search results.
 */
async function serpSearch(query, num = 5) {
    if (!SERPAPI_KEY) throw new Error("SERPAPI_KEY not set in .env");
    const { data } = await axios.get("https://serpapi.com/search", {
        params: { q: query, api_key: SERPAPI_KEY, num, engine: "google" },
        timeout: 15000,
    });
    return (data.organic_results || []).slice(0, num).map((r) => ({
        title: r.title || "",
        link: r.link || "",
        snippet: r.snippet || "",
    }));
}

/**
 * Try to scrape readable text from a URL (best effort, short timeout).
 */
async function scrapeText(url) {
    try {
        const { data } = await axios.get(url, {
            timeout: 8000,
            responseType: "text",
            headers: { "User-Agent": "Mozilla/5.0 (compatible; DeepResearchBot)" },
        });
        // Strip HTML tags simply
        const text = data
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s{3,}/g, "\n")
            .trim()
            .substring(0, 3000);
        return text;
    } catch {
        return "";
    }
}

// ─── Main controller ─────────────────────────────────────────────────────────

/**
 * POST /api/deep-research
 * Body: { query, depth, sources }
 * depth: 'Quick' | 'Balanced' | 'Deep'
 * sources: { Web: bool, Academic: bool, News: bool }
 */
async function deepResearch(req, res) {
    const { query, depth = "Balanced", sources = { Web: true } } = req.body;

    if (!query || !query.trim()) {
        return res.status(400).json({ error: "query is required" });
    }

    try {
        // ── Step 1: Generate sub-questions ───────────────────────────────
        const subQPrompt = `You are a research assistant. Given the main research topic below, generate ${depth === "Quick" ? 3 : depth === "Balanced" ? 5 : 7} focused sub-questions that will help comprehensively research this topic. Return ONLY a numbered list of questions, no extra text.

Topic: "${query}"`;

        const subQText = await callOpenAI(subQPrompt, 400);
        const subQuestions = subQText
            .split("\n")
            .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
            .filter((l) => l.length > 10)
            .slice(0, depth === "Quick" ? 3 : depth === "Balanced" ? 5 : 7);

        // ── Step 2: Web search for each sub-question ─────────────────────
        const numResults = depth === "Quick" ? 3 : depth === "Balanced" ? 5 : 8;
        const searchPromises = subQuestions.map((q) => serpSearch(q, numResults));
        const allResultArrays = await Promise.all(searchPromises);

        // Deduplicate by URL
        const seen = new Set();
        const dedupedResults = [];
        allResultArrays.flat().forEach((r) => {
            if (!seen.has(r.link)) {
                seen.add(r.link);
                dedupedResults.push(r);
            }
        });

        // Also search by main query
        const mainResults = await serpSearch(query, numResults);
        mainResults.forEach((r) => {
            if (!seen.has(r.link)) {
                seen.add(r.link);
                dedupedResults.push(r);
            }
        });

        const topSources = dedupedResults.slice(0, depth === "Quick" ? 5 : depth === "Balanced" ? 10 : 15);

        // ── Step 3: Optionally scrape page content for deeper context ─────
        let scrapedContent = [];
        if (depth !== "Quick") {
            const scrapeLimit = depth === "Balanced" ? 4 : 7;
            const scrapeResults = await Promise.all(
                topSources.slice(0, scrapeLimit).map(async (s) => ({
                    url: s.link,
                    title: s.title,
                    text: await scrapeText(s.link),
                }))
            );
            scrapedContent = scrapeResults.filter((r) => r.text.length > 100);
        }

        // ── Step 4: Build context for final synthesis ─────────────────────
        const sourceSummary = topSources
            .map((s, i) => `[${i + 1}] ${s.title}\nURL: ${s.link}\nSnippet: ${s.snippet}`)
            .join("\n\n");

        const scrapedSummary =
            scrapedContent.length > 0
                ? "\n\n### Additional Page Content:\n" +
                scrapedContent
                    .map((s) => `Source: ${s.title} (${s.url})\n${s.text.substring(0, 800)}`)
                    .join("\n\n---\n\n")
                : "";

        // ── Step 5: Synthesize final report ───────────────────────────────
        const reportPrompt = `You are an expert research analyst. Using the web search results below, write a comprehensive, well-structured research report on the topic.

## Topic: "${query}"
## Research Depth: ${depth}
## Sub-questions researched: 
${subQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

## Search Results:
${sourceSummary}
${scrapedSummary}

## Instructions:
- Write a detailed, well-organized report with clear sections and headings using Markdown
- Include an Executive Summary at the top
- Organize by key themes/sections
- Synthesize insights across multiple sources
- Include inline citations like [1], [2], etc. referring to the source numbers
- End with a Conclusion & Key Takeaways section
- End with a "## References" section listing all cited sources with their URLs
- Be comprehensive but clear and easy to read
- Do NOT make up information not found in the sources`;

        const report = await callOpenAI(reportPrompt, depth === "Quick" ? 1500 : depth === "Balanced" ? 2500 : 4000);

        // ── Step 6: Return response ────────────────────────────────────────
        return res.json({
            success: true,
            query,
            depth,
            subQuestions,
            sources: topSources,
            report,
            sourcesCount: topSources.length,
        });
    } catch (err) {
        console.error("Deep Research error:", err.message);
        return res.status(500).json({
            error: err.message || "Deep research failed",
            detail: err?.response?.data || null,
        });
    }
}

module.exports = { deepResearch };
