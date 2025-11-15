import React, { useState, useEffect } from 'react';
import './RecipeModal.css';

function RecipeModal({ recipe, onClose }) {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);

 const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
        );
        const data = await response.json();
        setRecipeDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipe.id]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-loading">
            <div className="spinner"></div>
            <p>Loading recipe details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Failed to load recipe details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <img src={recipeDetails.image} alt={recipeDetails.title} />
          <div className="modal-header-info">
            <h2>{recipeDetails.title}</h2>
            <div className="recipe-meta">
              <span>⏱️ {recipeDetails.readyInMinutes} mins</span>
              <span>🍽️ {recipeDetails.servings} servings</span>
              {recipeDetails.healthScore && (
                <span>💚 Health Score: {recipeDetails.healthScore}/100</span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Summary */}
          {recipeDetails.summary && (
            <div className="section">
              <h3>About This Recipe</h3>
              <div 
                dangerouslySetInnerHTML={{ __html: recipeDetails.summary }}
                className="recipe-summary"
              />
            </div>
          )}

          {/* Ingredients */}
          <div className="section">
            <h3>📝 Ingredients</h3>
            <ul className="ingredients-list">
              {recipeDetails.extendedIngredients && recipeDetails.extendedIngredients.map((ingredient, index) => (
                <li key={index}>
                  <strong>{ingredient.amount} {ingredient.unit}</strong> {ingredient.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          {recipeDetails.instructions && (
            <div className="section">
              <h3>👨‍🍳 Instructions</h3>
              <div 
                dangerouslySetInnerHTML={{ __html: recipeDetails.instructions }}
                className="recipe-instructions"
              />
            </div>
          )}

          {/* External Link */}
          {recipeDetails.sourceUrl && (
            <div className="section">
              <a 
                href={recipeDetails.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link-btn"
              >
                View Original Recipe →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;