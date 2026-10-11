
export async function POST(request) {
    try {
        const { language, difficulty, topic, numQuestions } =
            await request.json()

        const apiKey = process.env.GEMINI_API_KEY

        if (!apiKey) {
            return new Response('Missing GEMINI_API_KEY in .env.local', {
                status: 500,
            })
        }

        const subject =
            topic === 'random'
                ? `a random topic in ${language}`
                : `${topic} in ${language}`

        const prompt = `
You are an environmental science educator creating educational quizzes.

Generate exactly ${numQuestions} multiple-choice questions.
Subject: Environmental Science.
Category: ${topic === 'random' ? 'Choose a variety of environmental science topics' : topic}.
Difficulty: ${difficulty}.

STRICT REQUIREMENTS:
- Every question must be about the environment, ecology, or sustainability.
- Do NOT generate questions about programming, coding, JavaScript, Python, React, or CSS.
- Cover relevant environmental concepts, causes, effects, prevention, and solutions.
- Each question must have exactly four distinct answer choices.
- Questions must be factually accurate and appropriate for the requested difficulty.
- Avoid repeating questions.
- The correct answer must be represented by a zero-based index (0, 1, 2, or 3).
- Provide a brief explanation of why the correct answer is right.

Return ONLY valid JSON in this exact structure:
{
  "questions": [
    {
      "query": "Question text",
      "choices": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      "answer": 0,
      "explanation": "Explanation of the correct answer"
    }
  ]
}

Do not include Markdown fences or any text outside the JSON.
`


        const response = await fetch(
            
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',

            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: 'application/json',
                    },
                }),
            }
        )

        const data = await response.json()

        if (!response.ok) {
            console.error('Gemini API error:', response.status, data)

            return new Response(
                data.error?.message || 'Gemini API request failed',
                { status: response.status }
            )
        }

        const text = data.candidates?.[0]?.content?.parts
            ?.map((part) => part.text || '')
            .join('')

        if (!text) {
            console.error('Gemini returned no text:', data)

            return new Response('Gemini returned an empty response', {
                status: 502,
            })
        }

        // Preserve the raw JSON response expected by the existing quiz page.
        JSON.parse(text)

        return new Response(text, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Quiz generation failed:', error)

        return new Response('Quiz generation failed. Check the terminal.', {
            status: 500,
        })
    }
}
