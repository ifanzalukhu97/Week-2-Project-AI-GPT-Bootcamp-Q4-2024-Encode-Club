"use client";

import { useState } from "react";
import { useChat } from "ai/react";

export default function Chat() {

  const [state, setState] = useState({
    topic: "",
    tone: "",
    type: "",
    temperature: 0.7, // default value
  });

  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
    body: {
      temperature: state.temperature,
    },
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
    { emoji: "📖", value: "Story" }
  ];

  const handleChange = ({
                          target: { name, value },
                        }: React.ChangeEvent<HTMLInputElement>) => {

    setState({
      ...state,
      [name]: value,
    });
  };

  return (
      <main className="mx-auto w-full p-24 flex flex-col">
        <div className="p4 m-4">
          <div className="flex flex-col items-center justify-center space-y-8 text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Jokes Generator</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Customize the jokes by selecting the topic, tone, type and temperature.
              </p>
            </div>

            {/* topic selection code */}
            <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Topic</h3>

              <div className="flex flex-wrap justify-center">
                {topics.map(({value, emoji}) => (
                    <div
                        key={value}
                        className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                    >
                      <input
                          id={value}
                          type="radio"
                          value={value}
                          name="topic"
                          onChange={handleChange}
                      />
                      <label className="ml-2" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                ))}
              </div>
            </div>

            {/* tone selection code */}
            <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Tones</h3>

              <div className="flex flex-wrap justify-center">
                {tones.map(({value, emoji}) => (
                    <div
                        key={value}
                        className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                    >
                      <input
                          id={value}
                          type="radio"
                          name="tone"
                          value={value}
                          onChange={handleChange}
                      />
                      <label className="ml-2" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                ))}
              </div>
            </div>

            {/* type selection code */}
            <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Types</h3>

              <div className="flex flex-wrap justify-center">
                {types.map(({value, emoji}) => (
                    <div
                        key={value}
                        className="p-4 m-2 bg-opacity-25 bg-gray-600 rounded-lg"
                    >
                      <input
                          id={value}
                          type="radio"
                          name="type"
                          value={value}
                          onChange={handleChange}
                      />
                      <label className="ml-2" htmlFor={value}>
                        {`${emoji} ${value}`}
                      </label>
                    </div>
                ))}
              </div>
            </div>

            {/* temperature selection code */}
            <div className="space-y-4 bg-opacity-25 bg-gray-700 rounded-lg p-4">
              <h3 className="text-xl font-semibold">Temperature</h3>
              <div className="flex items-center space-x-4">
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    name="temperature"
                    value={state.temperature}
                    onChange={handleChange}
                    className="w-64"
                />
                <span>{state.temperature}</span>
              </div>
            </div>

            {/* button code */}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                disabled={isLoading || !state.topic || !state.tone || !state.type}
                onClick={() =>
                    append({
                      role: "user",
                      content: `Generate a ${state.topic} joke in a ${state.tone} tone and ${state.type} type.`,
                    })
                }
            >
              Generate Jokes
            </button>

            {/* chat messages code */}
            <div
                hidden={
                    messages.length === 0 ||
                    messages[messages.length - 1]?.content.startsWith("Generate")
                }
                className="bg-opacity-25 bg-gray-700 rounded-lg p-4"
            >
              {messages[messages.length - 1]?.content}
            </div>
          </div>
        </div>
      </main>
  );
}
