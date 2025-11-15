import React, { useState } from 'react';
import './RecipeCard.css';
import RecipeModal from './RecipeModal';

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const [showModal, setShowModal] = useState(false);

  const handleViewRecipe = () => {
    setShowModal(true);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  return (
    <>
      <div className="recipe-card">
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        
        <div className="recipe-image-container">
          <img 
            src={recipe.image || 'https://via.placeholder.com/400x300?text=No+Image'} 
            alt={recipe.title}
            className="recipe-image"
          />
        </div>
        
        <div className="recipe-content">
          <h3 className="recipe-title">{recipe.title}</h3>
          
          <div className="recipe-info">
            <span className="info-item">
              ⏱️ {recipe.cookTime}
            </span>
            <span className="info-item">
              🍽️ {recipe.servings} servings
            </span>
          </div>

          <div className="recipe-ingredients">
            <h4>Ingredients:</h4>
            <div className="ingredients-tags">
              {recipe.ingredients && recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                <span key={index} className="ingredient-tag">
                  {ingredient}
                </span>
              ))}
              {recipe.ingredients && recipe.ingredients.length > 4 && (
                <span className="ingredient-tag more">
                  +{recipe.ingredients.length - 4} more
                </span>
              )}
              {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                <span className="ingredient-tag">No ingredients listed</span>
              )}
            </div>
          </div>

          <button className="view-recipe-btn" onClick={handleViewRecipe}>
            View Full Recipe
          </button>
        </div>
      </div>

      {showModal && (
        <RecipeModal 
          recipe={recipe} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}

export default RecipeCard;