import React, { useState } from "react";

export default function Form({ handleSubmit }) {
  const [person, setPerson] = useState({ name: "", job: "" });
  const [busy, setBusy] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setPerson(p => ({ ...p, [name]: value }));
  }

  async function submitForm() {
    if (!person.name.trim() || !person.job.trim()) {
      alert("Name and job are required.");
      return;
    }
    setBusy(true);
    try {
      await handleSubmit({ name: person.name.trim(), job: person.job.trim() });
      setPerson({ name: "", job: "" });
    } catch (e) {
      alert(e.message || "Failed to create user");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" value={person.name} onChange={handleChange}/>
        <label htmlFor="job">Job</label>
        <input id="job" name="job" value={person.job} onChange={handleChange}/>
        <input type="button" value={busy ? "Adding…" : "Submit"} onClick={submitForm} disabled={busy}/>
      </form>
    </div>
  );
}
