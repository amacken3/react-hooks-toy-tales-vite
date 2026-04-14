import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([])

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((data) => setToys(data))
  }, [])
//add toy
  function handleAddToy(newToyData) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newToyData)
    })
      .then((response) => response.json())
      .then((createdToy) => {
        setToys((currentToys) => [...currentToys, createdToy]);
      });
  }
  //DELETE toy
  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE"
    }).then(() => {
      setToys((currentToys) => currentToys.filter((toy) => toy.id !== id));
    });
  }

   function handleLikeToy(likedToy) {
    const updatedLikes = likedToy.likes + 1;

    fetch(`http://localhost:3001/toys/${likedToy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ likes: updatedLikes })
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        setToys((currentToys) =>
          currentToys.map((toy) =>
            toy.id === updatedToy.id ? updatedToy : toy
          )
        );
      });
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onDeleteToy={handleDeleteToy} onLikeToy={handleLikeToy} />
    </>
  );
}

export default App;