// packages/react-frontend/src/MyApp.jsx
import React, { useEffect, useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Your backend’s base URL
  const API_BASE = "http://localhost:8000";

  // Load users on mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_BASE}/users`);
        const json = await res.json();
        setCharacters(json.users_list || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Create (POST) → require 201; use returned object (with id)
  async function updateList(person) {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(person),
      });

      if (res.status !== 201) {
        const msg = await res.text().catch(() => "");
        throw new Error(`Create failed (expected 201). ${msg}`);
      }

      const created = await res.json(); // server-generated id
      setCharacters((prev) => [...prev, created]);
    } catch (err) {
      alert(err.message || "Failed to create user");
    }
  }

  // Delete (DELETE) → only update UI on 204
  async function removeOneCharacter(id) {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });

      if (res.status === 204) {
        setCharacters((prev) => prev.filter((c) => c.id !== id));
      } else if (res.status === 404) {
        alert("User not found.");
      } else {
        const msg = await res.text().catch(() => "");
        alert(`Unexpected delete status ${res.status}. ${msg}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  if (loading) return <div className="container"><p>Loading…</p></div>;

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
