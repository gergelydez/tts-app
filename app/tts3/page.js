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
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    setCharacterCount(newText.length);
    setDuration(calculateDuration(newText));
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handlePitchChange = (event) => {
    const newPitch = parseFloat(event.target.value);
    setPitch(newPitch);
  };

  const handleRateChange = (event) => {
    const newRate = parseFloat(event.target.value);
    setRate(newRate);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
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
        utterance.pitch = pitch;
        utterance.rate = rate;
        utterance.volume = volume;
        synthesis.speak(utterance);
        synthesisRef.current = synthesis;
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const synthesis = window.speechSynthesis;
      const updateVoices = () => {
        const voices = synthesis.getVoices();
        setAvailableLanguages(voices.map((voice) => voice.lang));
      };

      synthesis.addEventListener("voiceschanged", updateVoices);
      updateVoices();

      return () => {
        synthesis.removeEventListener("voiceschanged", updateVoices);
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <textarea
        className="w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12 h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text"
      />
      <div className="mt-2 text-gray-600">
        Character Count: {characterCount}
      </div>
      <div className="mt-2 text-gray-600">Duration: {duration} seconds</div>
      <div className="mt-4 w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
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
      <div className="mt-4 w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <label htmlFor="pitchSlider" className="mr-2 text-gray-600">
          Pitch: {pitch.toFixed(1)}
        </label>
        <input
          id="pitchSlider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={handlePitchChange}
          className="w-full"
        />
      </div>
      <div className="mt-4 w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <label htmlFor="rateSlider" className="mr-2 text-gray-600">
          Rate: {rate.toFixed(1)}
        </label>
        <input
          id="rateSlider"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={rate}
          onChange={handleRateChange}
          className="w-full"
        />
      </div>
      <div className="mt-4 w-11/12 sm:w-9/12 md:w-7/12 lg:w-5/12 xl:w-4/12">
        <label htmlFor="volumeSlider" className="mr-2 text-gray-600">
          Volume: {volume.toFixed(1)}
        </label>
        <input
          id="volumeSlider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full"
        />
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
