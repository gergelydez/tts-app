"use client";

import { useState, useEffect, useRef } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const synthesisRef = useRef(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [characterCount, setCharacterCount] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setCharacterCount(newText.length);
    setDuration(calculateDuration(newText));
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const calculateDuration = (text) => {
    // A feltételezett átlagos szó sebesség 150 karakter per másodperc
    const averageWordSpeed = 150;
    const wordCount = text.trim().split(/\s+/).length;
    const durationInSeconds = Math.ceil(wordCount / averageWordSpeed);
    return durationInSeconds;
  };
  const handleTogglePlayback = () => {
    if ("speechSynthesis" in window) {
      if (isPlaying) {
        synthesisRef.current.cancel();
      } else {
        const synthesis = window.speechSynthesis;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synthesis.speak(utterance);
        synthesisRef.current = synthesis;
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const synthesis = window.speechSynthesis;
      const voices = synthesis.getVoices();
      setAvailableLanguages(voices.map((voice) => voice.lang));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <textarea
        className="w-1/2 h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text"
      />{" "}
      <div className="mt-2 text-gray-600">
        Character Count: {characterCount}
      </div>
      <div className="mt-2 text-gray-600">Duration: {duration} seconds</div>
      <div className="mt-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="">Select Language</option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <button
          className={`px-4 py-2 rounded-lg focus:outline-none ${
            isPlaying ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={handleTogglePlayback}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      <audio ref={audioRef} controls className="hidden" />
    </div>
  );
}
