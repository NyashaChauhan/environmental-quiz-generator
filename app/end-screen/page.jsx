
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { pickRandom } from '../utils'
import { endMessages } from '../constants/endMessages'
import { gifs } from '../constants/gifs'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const EndScreen = () => {
    const router = useRouter()
    const params = useSearchParams()
    const score = Number(params.get('score') || 0)
    const correct = Number(params.get('correct') || 0)
    const incorrect = Number(params.get('incorrect') || 0)

    const [message, setMessage] = useState('')
    const [gif, setGif] = useState('')

    const { width, height } = useWindowSize()

    const percentage = Math.round(score * 100)

    let resultTitle = 'Keep Learning!'
    let resultDescription =
        'Every small step towards environmental awareness makes a difference.'

    if (percentage === 100) {
        resultTitle = 'Excellent Work!'
        resultDescription =
            'Perfect score! You have demonstrated excellent environmental knowledge.'
    } else if (percentage >= 70) {
        resultTitle = 'Great Job!'
        resultDescription =
            'You have a good understanding of environmental topics. Keep it up!'
    }

    useEffect(() => {
        let grade = 'bad'

        if (score === 1) {
            grade = 'perfect'
        } else if (score >= 0.7) {
            grade = 'good'
        }

        setMessage(pickRandom(endMessages[grade]))
        setGif(pickRandom(gifs[grade]))
    }, [score])

    return (
        <main className="min-h-screen grid place-items-center px-4 py-12">
            
            {percentage >= 80 && (
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                    <Confetti
                        width={width}
                        height={height}
                        numberOfPieces={180}
                        recycle={true}
                        gravity={0.25}
                    />
                </div>
            )}


            <section className="z-10 w-full max-w-2xl text-center">
                <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
                    Environmental Quiz Generator
                </p>

                <h1 className="mt-5 text-4xl sm:text-5xl font-bold">
                    {resultTitle}
                </h1>

                <div className="mt-8 rounded-2xl border border-emerald-400/40 p-8">
                    <p className="text-sm uppercase tracking-widest text-white/70">
                        Your Final Score
                    </p>

                    <p className="mt-3 text-6xl sm:text-7xl font-bold text-emerald-400">
                        {percentage}%
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 p-4">
                            <p className="text-sm text-white/70">Correct Answers</p>
                            <p className="mt-2 text-3xl font-bold text-emerald-400">
                                {correct}
                            </p>
                        </div>

                        <div className="rounded-xl bg-red-500/10 border border-red-400/30 p-4">
                            <p className="text-sm text-white/70">Incorrect Answers</p>
                            <p className="mt-2 text-3xl font-bold text-red-400">
                                {incorrect}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-emerald-400 transition-all"
                            style={{
                                width: `${Math.max(0, Math.min(100, percentage))}%`,
                            }}
                        />
                    </div>

                    <p className="mt-6 text-base text-white/80">
                        {resultDescription}
                    </p>
                </div>

                {gif && (
                    <iframe
                        src={gif}
                        title="Quiz result celebration"
                        width="100%"
                        height="250"
                        className="mx-auto mt-8 max-w-md rounded-xl"
                        allowFullScreen
                    />
                )}

                <p className="mt-6 text-xl">{message}</p>

                <p className="mt-4 text-sm text-white/70">
                    Learning about our planet is the first step towards
                    protecting it. Take another quiz to keep building your
                    environmental knowledge!
                </p>

                <button
                    className="mt-8 rounded-lg border-2 border-emerald-400 px-7 py-3 font-semibold uppercase text-emerald-400 transition hover:bg-emerald-400/20"
                    onClick={() => router.push('/')}
                >
                    Try Another Quiz
                </button>
            </section>
        </main>
    )
}

export default EndScreen
