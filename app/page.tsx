"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {
    const [state, setState] = useState({
        topic: "",
        tone: "",
        type: "",
        temperature: 0.7,
    });

    const [showEvaluation, setShowEvaluation] = useState(false);
    const [audioIsLoading, setAudioIsLoading] = useState(false);
    const [evaluationAudioIsLoading, setEvaluationAudioIsLoading] = useState(false);
    const [audio, setAudio] = useState<string | null>(null);

    const { messages, append, isLoading } = useChat({
        api: "/api/chat",
        body: {
            temperature: state.temperature,
        },
    });

    const { messages: evaluationMessages, append: appendEvaluation } = useChat({
        api: "/api/chat",
        id: "evaluation",
    });

    const topics = [
        { emoji: "💼", value: "Work" },
        { emoji: "️👥", value: "People" },
        { emoji: "🐾", value: "Animals" },
        { emoji: "🍔", value: "Food" },
        { emoji: "📺", value: "Television" },
    ];

    const tones = [
        { emoji: "😜", value: "Witty" },
        { emoji: "😏", value: "Sarcastic" },
        { emoji: "🤪", value: "Silly" },
        { emoji: "🌑", value: "Dark" },
        { emoji: "🤡", value: "Goofy" },
    ];

    const types = [
        { emoji: "😂", value: "Pun" },
        { emoji: "🔔", value: "Knock-knock" },
        { emoji: "📖", value: "Story" },
    ];

    const handleChange = ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [name]: value,
        });
    };

    const handleGenerateJoke = () => {
        setShowEvaluation(false);
        append({
            role: "user",
            content: `Generate a ${state.topic} joke in a ${state.tone} tone and ${state.type} type.`,
        });
    };

    const handleEvaluate = () => {
        const lastJoke = messages[messages.length - 1]?.content;
        if (lastJoke && !lastJoke.startsWith("Generate")) {
            appendEvaluation({
                role: "user",
                content: `Please evaluate this joke: "${lastJoke}". Provide a detailed analysis of its humor level, appropriateness, originality, potential offensiveness, and target audience suitability.`,
            });
            setShowEvaluation(true);
        }
    };

    // Fungsi untuk menghasilkan audio dari joke
    const handleGenerateAudio = (text: string) => {
        setAudioIsLoading(true);
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            setAudioIsLoading(false);
            setAudio(text);
        };

        synth.speak(utterance);
    };

    // Fungsi untuk audio dari evaluasi joke
    const handleGenerateEvaluationAudio = (text: string) => {
        setEvaluationAudioIsLoading(true);
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            setEvaluationAudioIsLoading(false);
        };

        synth.speak(utterance);
    };

    return (
        <main className="max-w-4xl mx-auto p-8">
            {/* Header Section */}
            <header className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Jokes Generator</h2>
                <p className="text-zinc-400">
                    Customize the jokes by selecting the topic, tone, type and temperature.
                </p>
            </header>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Topic Selection */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Topic</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {topics.map(({ value, emoji }) => (
                            <label
                                key={value}
                                className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                            >
                                <input
                                    type="radio"
                                    value={value}
                                    name="topic"
                                    onChange={handleChange}
                                    className="mr-3"
                                />
                                <span className="text-white">{`${emoji} ${value}`}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tone Selection */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Tone</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {tones.map(({ value, emoji }) => (
                            <label
                                key={value}
                                className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="tone"
                                    value={value}
                                    onChange={handleChange}
                                    className="mr-3"
                                />
                                <span className="text-white">{`${emoji} ${value}`}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Type Selection */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {types.map(({ value, emoji }) => (
                            <label
                                key={value}
                                className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="type"
                                    value={value}
                                    onChange={handleChange}
                                    className="mr-3"
                                />
                                <span className="text-white">{`${emoji} ${value}`}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Temperature Control */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Temperature</h3>
                    <div className="flex items-center space-x-4">
                        <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            name="temperature"
                            value={state.temperature}
                            onChange={handleChange}
                            className="flex-1"
                        />
                        <span className="text-white min-w-[3ch]">{state.temperature}</span>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <div className="text-center mb-8">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 transition-colors"
                    disabled={isLoading || !state.topic || !state.tone || !state.type}
                    onClick={handleGenerateJoke}
                >
                    {isLoading ? "Generating..." : "Generate Joke"}
                </button>
            </div>

           {/* Result Display */}
{messages.length > 0 && !messages[messages.length - 1]?.content.startsWith("Generate") && (
    <div className="flex items-center bg-gray-800 rounded-xl p-6 text-white mb-4">
        <p className="text-lg flex-1">{messages[messages.length - 1]?.content}</p>
        
        {/* Audio Button di sebelah hasil joke */}
        <div className="ml-4">
            {audioIsLoading ? (
                <p>Audio is being generated...</p>
            ) : (
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    onClick={() => handleGenerateAudio(messages[messages.length - 1]?.content)}
                >
                    Play Audio
                </button>
            )}
        </div>
    </div>
)}

{/* Evaluate Button - only show if not already evaluated */}
{messages.length > 0 && !showEvaluation && !messages[messages.length - 1]?.content.startsWith("Generate") && (
    <div className="text-center mb-8">
        <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            onClick={handleEvaluate}
        >
            Evaluate Joke
        </button>
    </div>
)}


            {/* Evaluation Result */}
            {showEvaluation && evaluationMessages.length > 0 && (
                <>
                    <div className="bg-gray-800 rounded-xl p-6 text-white mb-4">
                        <h3 className="text-xl font-semibold mb-4">Joke Evaluation</h3>
                        <p className="text-lg whitespace-pre-line">
                            {evaluationMessages[evaluationMessages.length - 1]?.content}
                        </p>
                    </div>

                    {/* Audio Button for Evaluation */}
                    <div className="text-center mb-8">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                            onClick={() => handleGenerateEvaluationAudio(evaluationMessages[evaluationMessages.length - 1]?.content)}
                        >
                            {evaluationAudioIsLoading ? "Loading Audio..." : "Play Evaluation Audio"}
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}
