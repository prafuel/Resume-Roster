'use client';

import { useState, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import html2canvas from 'html2canvas';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faDownload, faMultiply, faShareNodes } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [character, setCharacter] = useState("Roaster");
  const [resultsHistory, setResultsHistory] = useState([]); // State for history

  const defaultCharacters = [
    { name: "Light Yagami", emoji: "📝" },
    { name: "Eren Yeager", emoji: "🗿" },
    { name: "Salman Khan", emoji: "🎬" },
    { name: "Elon Musk", emoji: "🚀" },
    { name: "Modi Ji", emoji: "🇮🇳" },
    { name: "Average Reddit User", emoji: "👨‍💻" },
    { name: "Saitama", emoji: "👊" }
  ];

  // const url = "https://prafuel-r2.hf.space/roast"
  const url = "http://127.0.0.1:8000/roast"

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    if(character == ""){
      setCharacter("Roaster")
    }

    console.log(character);

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("character", character);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setResultsHistory((prev) => [...prev, { output: data.output, timestamp, character: character }]); // Append result and timestamp to history
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (index) => {
    const element = document.getElementById(`result-${index}`);
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `RoastResult-${index + 1}.png`; // Unique filename for each result
      link.click();
    });
  };

  const handleShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleDelete = (index) => {
    // Create a new array excluding the item at the specified index
    const updatedHistory = resultsHistory.filter((_, i) => i !== index);

    // Update the state with the new array
    setResultsHistory(updatedHistory);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">

        {/* Character Selection Section */}
        <div className="lg:w-1/2 bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-extrabold text-orange-400 mb-4 text-center">Select a Character</h2>
          <div className="h-48 overflow-y-auto mb-4">
            {defaultCharacters.map((char) => (
              <button
                key={char.name}
                onClick={() => setCharacter(char.name)}
                className={`w-full py-2 px-4 my-2 rounded-lg text-white font-semibold flex items-center space-x-2 justify-start ${character === char.name ? "bg-orange-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                <span>{char.emoji}</span>
                <span>{char.name}</span>
              </button>
            ))}
          </div>
          <div>
            <input
              type="text"
              placeholder="Custom character..."
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              className="block w-full text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Main Roast Resume Section */}
        <div className="lg:w-3/4 bg-gray-800 shadow-lg rounded-xl p-6 sm:p-10 border border-gray-700">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-400 mb-4 sm:mb-6 text-center">Resume Roaster</h1>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div>
              <label className="block text-orange-300 text-sm sm:text-base font-medium mb-2" htmlFor="file">
                Upload your Resume and get BADLY HUMILIATED by Ai...
              </label>
              <input
                type="file"
                id="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 sm:py-3 px-4 sm:px-5 rounded-lg text-white font-semibold transition-colors duration-300 ${loading ? "bg-orange-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
                }`}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
            {loading && (
              <div className="flex justify-center mt-4">
                <ClipLoader color={"#FFA500"} loading={loading} size={50} />
              </div>
            )}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </form>
        </div>
      </div>

      {/* Results History Section */}
      {resultsHistory.length > 0 && (
        <div className="mt-8 w-full max-w-7xl bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {resultsHistory.map((historyResult, index) => (
              <div
                key={index}
                id={`result-${index}`}
                className="relative flex-shrink-0 min-w-[290px] w-1/2 h-[500px] p-4 border-2 border-gray-600 bg-gray-700 shadow-md text-center flex flex-col justify-between rounded-lg"
              >
                {/* Heading and Cross button in Flex */}
                <div className="flex items-center justify-between bg-gray-600 h-14 w-full rounded-t-lg">
                  <h2 className="text-white text-lg font-bold px-2">{historyResult.timestamp}</h2>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 text-white h-full hover:bg-red-700 focus:outline-none p-4"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <span className="text-gray-300 text-sm">({historyResult.character})</span>
                <p
                  style={{ whiteSpace: 'pre-wrap' }}
                  className="text-white leading-relaxed overflow-y-auto flex-grow py-2 text-md text-center"
                >
                  {historyResult.output}
                </p>

                <button
                  onClick={() => handleDownload(index)} // Pass the index for unique downloads
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}




      <div className="text-center mt-6 text-gray-400 text-xs sm:text-sm">
        Created by <a href="https://github.com/prafuel" className="text-orange-500 hover:underline">@prafuel</a>
      </div>
    </div>
  );
}
