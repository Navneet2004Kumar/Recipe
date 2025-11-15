import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/searchbar';
import RecipeCard from './components/recipecard';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);

  
  const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
  const BASE_URL = 'https://api.spoonacular.com/recipes';

 
  useEffect(() => {
    const savedFavorites = localStorage.getItem('recipeFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem('recipeFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setSearched(true);
    setError(null);
    setShowFavorites(false);
    
    try {
      const response = await fetch(
        `${BASE_URL}/complexSearch?query=${query}&apiKey=${API_KEY}&number=12&addRecipeInformation=true&fillIngredients=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      
      const transformedRecipes = data.results.map(recipe => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        ingredients: recipe.extendedIngredients 
          ? recipe.extendedIngredients.map(ing => ing.name)
          : [],
        cookTime: recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : 'N/A',
        servings: recipe.servings || 0,
        sourceUrl: recipe.sourceUrl,
        summary: recipe.summary
      }));
      
      setRecipes(transformedRecipes);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes. Please try again.');
      setLoading(false);
      setRecipes([]);
    }
  };

  const toggleFavorite = (recipe) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.id === recipe.id);
      
      if (isFavorite) {
        return prevFavorites.filter(fav => fav.id !== recipe.id);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setSearched(false);
  };

  const handleShowAll = () => {
    setShowFavorites(false);
  };

  const displayRecipes = showFavorites ? favorites : recipes;

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍳 Recipe Finder</h1>
        <p>Discover delicious recipes for any occasion</p>
        
        <div className="header-buttons">
          <button 
            className={`tab-button ${!showFavorites ? 'active' : ''}`}
            onClick={handleShowAll}
          >
            All Recipes
          </button>
          <button 
            className={`tab-button ${showFavorites ? 'active' : ''}`}
            onClick={handleShowFavorites}
          >
            ❤️ My Favorites ({favorites.length})
          </button>
        </div>
      </header>

      {!showFavorites && <SearchBar onSearch={handleSearch} />}

      <main className="recipe-container">
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching for recipes...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {!loading && searched && recipes.length === 0 && !error && (
          <div className="no-results">
            <p>😕 No recipes found. Try a different search!</p>
          </div>
        )}

        {showFavorites && favorites.length === 0 && (
          <div className="no-results">
            <p>💔 No favorites yet! Start adding some recipes to your favorites.</p>
          </div>
        )}

        {!loading && displayRecipes.length > 0 && (
          <div className="recipe-grid">
            {displayRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {!loading && !searched && !showFavorites && (
          <div className="welcome-message">
            <h2>Welcome to Recipe Finder! 👨‍🍳</h2>
            <p>Search for recipes by name or ingredients</p>
            <p className="examples">Try searching for: <strong>pasta</strong>, <strong>chicken</strong>, <strong>vegetarian</strong>, or <strong>chocolate</strong></p>
            <div className="feature-list">
              <div className="feature">🔍 Search thousands of recipes</div>
              <div className="feature">❤️ Save your favorites</div>
              <div className="feature">⏱️ See cooking times</div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Spoonacular API</p>
      </footer>
    </div>
  );
}


export default App;
