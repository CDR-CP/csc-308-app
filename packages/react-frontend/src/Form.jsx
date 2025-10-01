// src/Form.jsx
import React, { useState, useEffect } from "react";

function Form(props) {
  const [person, setPerson] = useState({
    name: "",
    job: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;

    if (name === "job") {
      setPerson({ name: person.name, job: value });
    } else {
      setPerson({ name: value, job: person.job });
    }
  }

  function submitForm() {
    props.handleSubmit(person);
    setPerson({ name: "", job: "" }); // reset the form after submit
  }
  
  // ---- silly stuff:
const konamiCode = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

const [konamiIndex, setKonamiIndex] = useState(0);
const [showSecret, setShowSecret] = useState(false);


useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === konamiCode[konamiIndex]) {
      setKonamiIndex((prev) => prev + 1);

      if (konamiIndex + 1 === konamiCode.length) {
        alert("Konami Code Activated! Secret unlocked!");
		setShowSecret(true); // Activates hidden state
        setKonamiIndex(0); // reset after success
      }
    } else {
      setKonamiIndex(0); // reset if wrong key
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [konamiIndex]);




  return (
 <div>
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="job">Job</label>
      <input
        type="text"
        name="job"
        id="job"
        value={person.job}
        onChange={handleChange}
      />
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
	
	{/* Secret box */}
      {showSecret && (
        <div>
          Secret Unlocked!
        </div>
      )}
    </div>
  );
}

export default Form;
