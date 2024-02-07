// Mobile menu
const hamburgerMenu = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
  hamburgerMenu.classList.remove('active');
  navMenu.classList.remove('active');
}));

const recipes = [];

// Save recipes to local storage
const saveToLocalStorage = () => {
  localStorage.setItem('recipes', JSON.stringify(recipes));
};

// Load recipes from local storage
const loadFromLocalStorage = () => {
  const storedRecipes = JSON.parse(localStorage.getItem('recipes'));
  if (storedRecipes) {
    recipes.push(...storedRecipes);
  }
};

// Function to display the details of a selected recipe
const displayRecipeDetails = (recipeId) => {
  const recipeDetailsContent = document.getElementById('recipe-details-content');
  const recipeToDisplay = recipes.find((recipe) => recipe.id === recipeId);
  // const editDeleteRecipeDiv = document.getElementById('edit-delete-recipe');

  if (recipeToDisplay) {
    recipeDetailsContent.innerHTML = `<img src="${recipeToDisplay.url}" alt="${recipeToDisplay.name}">
                                      <h3>${recipeToDisplay.name}</h3>
                                      <p>${recipeToDisplay.description}</p>`;
    // Show the modal
    const modal = document.getElementById('recipe-modal');
    modal.style.display = 'block';

    // Set the innerHTML of the edit-delete-recipe div
    const editDeleteRecipeDiv = document.getElementById('edit-delete-recipe');
    editDeleteRecipeDiv.innerHTML = `
      <button id="edit-recipe-btn" onclick="handleEditDelete('${recipeId}', 'edit')">Edit</button>
      <button id="delete-recipe-btn" onclick="handleEditDelete('${recipeId}', 'delete')">Delete</button>
    `;
  }
};

// Function to display recipes in the "Recipes" section
const displayRecipes = () => {
  const recipesList = document.getElementById('recipes-list');
  recipesList.innerHTML = '';

  if (recipes.length === 0) {
    recipesList.innerHTML = '<p>No recipes available.</p>';
  } else {
    recipes.forEach((recipe) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${recipe.url}" alt="${recipe.name}">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
      `;
      listItem.addEventListener('click', () => displayRecipeDetails(recipe.id));
      recipesList.appendChild(listItem);
    });
  }
};

// Call displayRecipes to initialize the list
displayRecipes();

// Function to reset the add recipe form
const resetForm = () => {
  document.getElementById('recipe-url').value = '';
  document.getElementById('recipe-name').value = '';
  document.getElementById('recipe-description').value = '';
};

// Function to display search results
const displaySearchResults = (results) => {
  const recipesList = document.getElementById('recipes-list');
  recipesList.innerHTML = '';

  if (results.length === 0) {
    recipesList.innerHTML = '<p>No matching recipes found.</p>';
  } else {
    results.forEach((recipe) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<img src="${recipe.url}" alt="${recipe.name}"><h3>${recipe.name}</h3><p>${recipe.description}</p>`;
      recipesList.appendChild(listItem);
    });
  }
};

// Function to search recipes
const searchRecipes = (event) => {
  event.preventDefault();

  const searchInput = document.querySelector('.search-box').value.toLowerCase();
  const filteredRecipes = recipes.filter((recipe) => recipe.name.toLowerCase().includes(searchInput)
  || recipe.description.toLowerCase().includes(searchInput));
  displaySearchResults(filteredRecipes);
};

// Attach the event listener to the form
document.getElementById('search-form').addEventListener('submit', searchRecipes);

// Function to add a recipe
const addRecipe = (event) => {
  event.preventDefault();

  const recipeUrl = document.getElementById('recipe-url').value;
  const recipeName = document.getElementById('recipe-name').value;
  const recipeDescription = document.getElementById('recipe-description').value;

  if (recipeUrl && recipeName && recipeDescription) {
    const newRecipe = {
      id: recipes.length + 1,
      url: recipeUrl,
      name: recipeName,
      description: recipeDescription,
    };

    recipes.push(newRecipe);
    displayRecipes();
    resetForm();
    saveToLocalStorage();
  } else {
    alert('Please fill in all fields');
  }
};

// Function to hide the modal
const hideRecipeDetails = () => {
  const modal = document.getElementById('recipe-modal');
  modal.style.display = 'none';
};

// Function to delete a recipe
const deleteRecipe = (recipeId) => {
  const confirmation = window.confirm('Are you sure you want to delete this recipe?');
  if (confirmation) {
    const index = recipes.findIndex((recipe) => recipe.id === recipeId);
    if (index !== -1) {
      recipes.splice(index, 1);
      saveToLocalStorage();
      displayRecipes();
      hideRecipeDetails();
    }
  }
};

// Function to edit a recipe
const editRecipe = (recipeId) => {
  // Find the recipe to edited
  const recipeToEdit = recipes.find((recipe) => recipe.id === recipeId);

  if (recipeToEdit) {
    // Pre-fill the form with existing values
    document.getElementById('recipe-url').value = recipeToEdit.url;
    document.getElementById('recipe-name').value = recipeToEdit.name;
    document.getElementById('recipe-description').value = recipeToEdit.description;

    // Update the recipe in the array when the is submitted
    document.getElementById('recipe-form').onsubmit = (event) => {
      event.preventDefault();

      // Update the existing recipe
      recipeToEdit.url = document.getElementById('recipe-url').value;
      recipeToEdit.name = document.getElementById('recipe-name').value;
      recipeToEdit.description = document.getElementById('recipe-description').value;

      resetForm();
      saveToLocalStorage();
      displayRecipes();
      hideRecipeDetails();
    };
  }
};

// Function to handle edit/delete actions
// eslint-disable-next-line no-unused-vars
const handleEditDelete = (recipeId, action) => {
  if (action === 'edit') {
    editRecipe(recipeId);
  } else if (action === 'delete') {
    deleteRecipe(recipeId);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      document.querySelectorAll('body').forEach((target) => target.classList.add('no-scroll'));
    });
  });
  document.querySelectorAll('.close-popup-btn').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      document.querySelectorAll('body').forEach((target) => target.classList.remove('no-scroll'));
    });
  });
});

loadFromLocalStorage();
displayRecipes();
addRecipe();
searchRecipes();
