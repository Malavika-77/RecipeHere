import React, { useState } from 'react';
import axios from 'axios';
import { FaStar, FaRegStar } from 'react-icons/fa';
import delicious from './Delicious.png';
import './style.css';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const YOUR_API_KEY = '098d89a5cb5d46d1988e2be8f8c3e525'; // Your API key for Spoonacular or any other recipe API

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${YOUR_API_KEY}`
      );

      const recipesWithDetails = await Promise.all(
        response.data.results.map(async (recipe) => {
          const detailsResponse = await axios.get(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${YOUR_API_KEY}`
          );
          return {
            ...recipe,
            spoonacularScore: detailsResponse.data.spoonacularScore || null,
          };
        })
      );

      setRecipes(recipesWithDetails);
      setShowResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecipeClick = async (id) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${YOUR_API_KEY}`
      );
      setSelectedRecipe(response.data);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating / 20);
    const emptyStars = 5 - fullStars;
    return (
      <div className="flex">
        {Array.from({ length: fullStars }).map((_, index) => (
          <FaStar key={index} className="text-yellow-500" />
        ))}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <FaRegStar key={index} className="text-yellow-500" />
        ))}
      </div>
    );
  };

  return (
   <div className="min-h-screen flex flex-col">
  {!showResults && (
    <div className="container w-full mx-auto p-4 min-h-screen flex flex-col justify-center items-center bg-cover bg-center" style={{ backgroundImage: `url(${require('./Contact.png')})` }}>
          <h1 className="text-5xl text-white font-bold text-center" style={{ width: "540px", top: "5px", left: "540px", position: "absolute", borderRadius: "20px" }}>FlavorFusion Recipe Search</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-md">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={query}
          onChange={handleChange}
          className="w-full p-2 border rounded-md mb-4" style={{ width: "540px", top: "500px", left: "520px", borderRadius: "20px" }}

        />
        <button type="submit" className="w-full bg-blue-500 text-white rounded-md py-2"style={{ width: "540px", top: "550px", left: "520px", borderRadius: "20px" }}>
          Search
        </button>
      </form>
    </div>
  )}




      {showResults && (
        <div className="container mx-auto p-4 flex-grow flex flex-col items-center" style={{ backgroundImage: `url(${require('./recipe.png')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <h1 className="text-5xl text-white font-bold text-center mb-8">𝕿𝖆𝖘𝖙𝖊 𝖙𝖍𝖊 𝖒𝖆𝖌𝖎𝖈</h1>
          <img src={delicious} alt="Delicious" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white p-4 rounded-md shadow-md cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-100 hover:text-blue"
                onClick={() => handleRecipeClick(recipe.id)}
              >
                <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} className="w-full h-40 mb-2 object-cover" />
                <p className="mb-2">Ready in {recipe.readyInMinutes} minutes</p>
                {recipe.spoonacularScore ? renderRating(recipe.spoonacularScore) : <p>No rating available</p>}
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white p-4 rounded-md shadow-md w-full h-auto text-center"style={{ backgroundImage: `url(${require('./Delicious.png')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <p className="text-lg text-blue-500 font-bold">Thank you for using FlavorFusion!</p>
          </div>
        </div>
      )}
      {showModal && selectedRecipe && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md max-w-lg w-full h-full overflow-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-auto mb-4" />
            <p>{selectedRecipe.summary.replace(/<[^>]+>/g, '')}</p>
            <p>Ready in {selectedRecipe.readyInMinutes} minutes</p>
            <p>Servings: {selectedRecipe.servings}</p>
            <button className="mt-4 bg-blue-500 text-white rounded-md py-2 px-4" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
