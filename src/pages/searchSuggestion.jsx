import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./searchSuggestion.css";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`${REACT_APP_API_BASE_URL}/v1/post/search-suggestions?q=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Suggestion fetch error:", err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (id) => {
    setQuery("");
    setSuggestions([]);
    navigate(`/post/${id}`);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search blogs by title, tags, desc or comments..."
        className="search-input"
      />
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((s) => (
            <li
              key={s._id}
              onClick={() => handleSelect(s._id)}
              className="suggestion-item"
            >
              {s.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
