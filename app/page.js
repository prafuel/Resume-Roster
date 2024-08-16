'use client';

import { useState, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import html2canvas from 'html2canvas';

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://prafuel-r2.hf.space/roast", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setResult(data.output);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    html2canvas(resultRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "RoastResult.png";
      link.click();
    });
  };

  const handleShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result)}`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-8">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-xl p-10 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-orange-400 mb-6 text-center">Resume Roaster</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-orange-300 text-sm font-medium mb-2" htmlFor="file">
              Upload your Resume and get BADLY ROASTED by Ai..
            </label>
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-gray-200 bg-gray-700 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-5 rounded-lg text-white font-semibold transition-colors duration-300 ${
              loading ? "bg-orange-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
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
          {result && (
            <div
              ref={resultRef}
              className="mt-8 p-6 border border-gray-600 rounded-lg bg-gray-700 shadow-sm text-center"
            >
              <h2 className="text-2xl font-semibold text-orange-400 mb-3"></h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{result}</p>
              <div className="mt-6 flex justify-around">
                <button
                  onClick={handleShare}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Share on Twitter
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Download as Image
                </button>
              </div>
            </div>
          )}
        </form>
        <div className="text-center mt-6 text-gray-400">
          Created by <a href="https://github.com/prafuel" className="text-orange-500 hover:underline">@prafuel</a>
        </div>
      </div>
    </div>
  );
}
