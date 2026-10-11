
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiGithub } from 'react-icons/fi'

const environmentalTopics = [
    { value: 'random', label: 'Random Environmental Topic' },
    { value: 'climate change', label: 'Climate Change' },
    { value: 'pollution', label: 'Pollution' },
    { value: 'biodiversity', label: 'Biodiversity' },
    { value: 'renewable energy', label: 'Renewable Energy' },
    { value: 'waste management', label: 'Waste Management' },
    { value: 'water conservation', label: 'Water Conservation' },
]

const HomePage = () => {
    const [topic, setTopic] = useState('random')
    const [difficulty, setDifficulty] = useState('beginner')
    const [numQuestions, setNumQuestions] = useState('5')

    return (
        <div className="min-h-screen grid place-items-center px-4 py-12">
            <div className="w-full max-w-3xl">
                <h1 className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 bg-clip-text text-transparent q-animate-gradient">
                    Environmental Quiz Generator
                </h1>

                <p className="mt-4 text-center text-sm sm:text-base text-white/70">
                    Learn about our planet through AI-generated quizzes.
                </p>

                <div className="mt-12 w-full sm:w-[80%] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        {/* ENVIRONMENTAL CATEGORY */}
                        <div className="flex flex-col">
                            <label htmlFor="topic" className="uppercase text-xs mb-2">
                                Environmental Category
                            </label>
                            <select
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="quiz-select"
                            >
                                {environmentalTopics.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DIFFICULTY */}
                        <div className="flex flex-col">
                            <label htmlFor="difficulty" className="uppercase text-xs mb-2">
                                Difficulty
                            </label>
                            <select
                                id="difficulty"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="quiz-select"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        {/* NUMBER OF QUESTIONS */}
                        <div className="flex flex-col sm:col-span-2">
                            <label htmlFor="numQuestions" className="uppercase text-xs mb-2">
                                Number of Questions
                            </label>
                            <select
                                id="numQuestions"
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(e.target.value)}
                                className="quiz-select"
                            >
                                <option value="5">5 Questions</option>
                                <option value="10">10 Questions</option>
                                <option value="15">15 Questions</option>
                                <option value="20">20 Questions</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <Link
                            className="q-button"
                            href={{
                                pathname: '/quiz',
                                query: {
                                    language: 'environmental science',
                                    difficulty,
                                    topic,
                                    numQuestions,
                                },
                            }}
                        >
                            Generate Environmental Quiz
                        </Link>
                    </div>
                </div>
            </div>

            <a
                className="fixed bottom-0 flex items-center gap-2 pb-2 font-mono text-xs sm:text-sm text-white/70 transition hover:text-emerald-300"
                href="https://github.com/quentin-mckay/ai-quiz-generator"
                target="_blank"
                rel="noreferrer"
            >
                <FiGithub size={16} />
                AI-Powered Environmental Education
            </a>
        </div>
    )
}

export default HomePage
