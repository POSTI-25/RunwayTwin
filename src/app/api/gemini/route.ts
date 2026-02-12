import { NextResponse } from 'next/server';

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'text-bison-001';

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set on server');

  // Using Google Generative Language REST API. Adjust endpoint/model as needed.
  const url = `https://generativelanguage.googleapis.com/v1beta2/models/${DEFAULT_MODEL}:generate?key=${apiKey}`;

  const body = {
    prompt: {
      text: prompt,
    },
    temperature: 0.2,
    maxOutputTokens: 1024,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${text}`);
  }

  const data = await res.json();

  // text-bison style: candidates[0].output OR maybe `candidates[0].content[0].text`
  const candidate = data?.candidates?.[0]?.output || data?.candidates?.[0]?.content?.[0]?.text || data?.output?.[0]?.content?.text;

  if (!candidate) {
    // Try other possible shapes
    const joined = JSON.stringify(data);
    return joined;
  }

  return candidate;
}

export async function POST(req: Request) {
  try {
    const { messages, dashboardState } = await req.json();

    // Build a single prompt that includes the system/dashboard context and the recent user message(s)
    const systemContext = `You are RunwayTwin's Financial Copilot. Answer concisely and only using the JSON dashboard context provided.`;

    const dashboardJson = JSON.stringify(dashboardState || {}, null, 2);

    const userContent = (messages || [])
      .map((m: any) => (m.parts && m.parts.map((p: any) => p.text).join('')) || m.text || '')
      .join('\n');

    const prompt = `${systemContext}\n\nDashboard:\n${dashboardJson}\n\nConversation:\n${userContent}`;

    const text = await callGemini(prompt);

    return NextResponse.json({ text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
