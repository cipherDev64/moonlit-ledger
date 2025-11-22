


export const config = {
    runtime: 'edge',
};

const SYSTEM_PROMPT = `
You are a wise, comforting, and insightful journaling companion. 
Your goal is to analyze the user's journal entry and provide a structured reflection.
Output MUST be a valid JSON object with the following schema:
{
  "mood": "string (one or two words describing the mood)",
  "intensity": "number (1-10)",
  "emoji": "string (single emoji representing the mood)",
  "color_hint": "string (hex color code matching the mood)",
  "summary": "string (brief 1-sentence summary)",
  "reflection": "string (a comforting, insightful paragraph reflecting on the entry)",
  "actionable_tip": "string (a small, gentle suggestion)",
  "gratitude_prompt": "string (a question to prompt gratitude)",
  "tone": "string (e.g., 'Melancholic', 'Hopeful', 'Frustrated')"
}

If the entry is too short or nonsensical to analyze, provide a gentle request for more detail in the 'reflection' field and neutral values for others.
`;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'Server configuration error: GEMINI_API_KEY is missing.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const { entry, mood_hint } = await req.json();

        if (!entry) {
            return new Response(
                JSON.stringify({ error: 'Entry is required.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const prompt = `
    User's Mood Hint: ${mood_hint || 'None'}
    
    Journal Entry:
    "${entry}"
    
    Analyze this entry and return the JSON response.
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: SYSTEM_PROMPT + "\n\n" + prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error('No content generated from Gemini.');
        }

        // Attempt to parse JSON from the response (handling potential markdown code blocks)
        let jsonString = generatedText.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        let parsedResult;
        try {
            parsedResult = JSON.parse(jsonString);
        } catch (e) {
            console.error('JSON Parse Error:', e, 'Raw text:', generatedText);
            // Fallback or partial parsing could go here
            return new Response(
                JSON.stringify({
                    error: 'Failed to parse AI response.',
                    raw_response: generatedText
                }),
                { status: 502, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify(parsedResult),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error: unknown) {
        console.error('Handler Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
