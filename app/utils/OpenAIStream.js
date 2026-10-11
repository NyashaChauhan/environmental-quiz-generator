
import { createParser } from 'eventsource-parser'

export async function OpenAIStream(payload) {
    const res = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
            },
            method: 'POST',
            body: JSON.stringify(payload),
        }
    )

    // Report API errors instead of leaving the quiz loading.
    if (!res.ok) {
        const errorText = await res.text()
        console.error('OpenAI API error:', res.status, errorText)

        throw new Error(
            `OpenAI API returned ${res.status}. Check the VS Code terminal.`
        )
    }

    if (!res.body) {
        throw new Error('OpenAI returned an empty response stream.')
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    return new ReadableStream({
        async start(controller) {
            const parser = createParser({
                onEvent(event) {
                    if (event.data === '[DONE]') {
                        controller.close()
                        return
                    }

                    try {
                        const json = JSON.parse(event.data)
                        const text = json.choices?.[0]?.delta?.content

                        if (text) {
                            controller.enqueue(encoder.encode(text))
                        }
                    } catch (error) {
                        controller.error(error)
                    }
                },
            })

            try {
                for await (const chunk of res.body) {
                    parser.feed(decoder.decode(chunk, { stream: true }))
                }

                parser.feed(decoder.decode())
            } catch (error) {
                controller.error(error)
            }
        },
    })
}
