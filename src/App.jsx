import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "./App.css";

// Base API URL (your ngrok tunnel)
const API_URL = "https://f008cc202b2b.ngrok-free.app/";

export default function App() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const cities = [
    "Thiruvananthapuram",
    "Trivandrum",
    "Kollam",
    "Alappuzha",
    "Pathanamthitta",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Kochi",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city || !date) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.get(`${API_URL}forecast`, {
        params: { city, date },
        headers: {
          // 👇 This header bypasses ngrok's interstitial warning
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*", // 👈 bypass ngrok’s block
        },
      });

      console.log("API response:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setResult({
        error: err.response?.data?.error || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🌤️ Climate Estimator</h1>
      <form onSubmit={handleSubmit} className="form">
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="select"
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date"
        />

        <button type="submit" className="button">
          {loading ? "Fetching..." : "Get Forecast"}
        </button>
      </form>

      {result && (
        <div className="result-card">
          {result.error ? (
            <p className="error">⚠️ {result.error}</p>
          ) : (
            <>
              <h2 className="city-name">{result.city}</h2>
              <p className="date-text">{result.date}</p>
              {result.source === "Open-Meteo API" ? (
                <>
                  <h3 className="temp">{result.temperature_C}°C</h3>
                  <p className="note">
                    Based on real-time forecast from Open-Meteo.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="prediction">
                    🌦️ Likely to be {result.predicted_weather} on this day
                  </h3>
                  <p className="note">
                    Predicted using ML model (beyond 16 days)
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
