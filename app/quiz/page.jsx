
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, useSpring } from 'framer-motion'

import LoadingScreen from '../components/LoadingScreen'
import Question from '../components/Question'

const QuizPage = () => {
    const params = useSearchParams()
    const router = useRouter()

    const language = params.get('language') || 'environmental science'
    const difficulty = params.get('difficulty') || 'beginner'
    const topic = params.get('topic') || 'random'
    const numQuestions = Number(params.get('numQuestions')) || 5

    const [quiz, setQuiz] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const [numSubmitted, setNumSubmitted] = useState(0)
    const [numCorrect, setNumCorrect] = useState(0)
    const [progress, setProgress] = useState(0)

    const scaleX = useSpring(progress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.002,
    })

    useEffect(() => {
        const generateQuestions = async () => {
            setIsLoading(true)
            setError('')

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        language,
                        difficulty,
                        topic,
                        numQuestions,
                    }),
                })

                if (!response.ok) {
                    const message = await response.text()
                    throw new Error(message || 'Failed to generate quiz.')
                }

                const data = await response.json()

                if (!Array.isArray(data.questions) || data.questions.length === 0) {
                    throw new Error('No questions were returned. Please try again.')
                }

                setQuiz(data.questions)
            } catch (err) {
                console.error('Quiz generation failed:', err)
                setError(err.message || 'Something went wrong. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        generateQuestions()
    }, [])

    useEffect(() => {
        const newProgress = numQuestions > 0
            ? numSubmitted / numQuestions
            : 0

        setProgress(newProgress)
        scaleX.set(newProgress)

        if (numSubmitted >= numQuestions && numQuestions > 0) {
            const score = numCorrect / numSubmitted
            const incorrect = numSubmitted - numCorrect

            router.push(
                `/end-screen?score=${score}&correct=${numCorrect}&incorrect=${incorrect}`
            )
        }
    }, [numSubmitted, numCorrect, numQuestions, router, scaleX])

    return (
        <div>
            <motion.div className="progress-bar" style={{ scaleX }} />

            {isLoading ? (
                <LoadingScreen responseStream="" />
            ) : error ? (
                <div className="mx-auto max-w-xl px-6 pt-16 text-center">
                    <h2 className="text-2xl font-semibold">
                        Unable to generate your quiz
                    </h2>
                    <p className="mt-4 text-gray-600">{error}</p>
                    <button
                        className="mt-6 rounded-lg bg-green-700 px-5 py-3 text-white"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="pt-12">
                    <h1 className="mb-8 text-center text-2xl font-semibold">
                        Environmental Quiz
                    </h1>

                    {quiz.map((question, index) => (
                        <div className="mb-12" key={index}>
                            <Question
                                question={question}
                                id={index}
                                setNumSubmitted={setNumSubmitted}
                                setNumCorrect={setNumCorrect}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default QuizPage
