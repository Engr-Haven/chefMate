let form = document.querySelector(`#form-field`);
let inputData = document.querySelector(`#meal-recipe`);
let printUIMain = document.querySelector(`#container-recipe-cont`);
let generalDiv = document.querySelector(`#general-container`);
let modalOverlay = document.querySelector(`#sec-modal-overlay-results`);
let closeOverlay = document.querySelector(`#close-icon`);
let mealNameDiv = document.querySelector(`#meal-name`);
let ingredientsDiv = document.querySelector(`#ingredients-measurement-container`);
let instructionsDiv = document.querySelector(`#instructions-container`);
let okBtn = document.querySelector(`#ok-btn`);
let errorMessage = document.querySelector(`#error-msg`);
let menuToggle = document.querySelector(`#menu-icon`);
let mobileMenuModal = document.querySelector(`#menu-modal`);
let menuToggleClosed = document.querySelector(`#close-menu-icon`);
let heroDiv = document.querySelector(`#hero-container-section`);

window.onload = function () {
    let randomFood = [
        `Chicken Fajita Mac and Cheese`, `Potato Gratin with Chicken`, 
        `Potato Salad (Olivier Salad)`, `Bread and Butter Pudding`, 
        `Portuguese fish stew (Caldeirada de peixe)`, `Fish Soup (Ukha)`
    ];
    let randomMealOutcome = randomFood[Math.floor(Math.random() * randomFood.length)];
    fetchMealData(randomMealOutcome);
};

form.addEventListener(`submit`, function (e) {
    e.preventDefault();
    const mealNameInput = inputData.value.trim();
    fetchMealData(mealNameInput);
    inputData.setAttribute(`readonly`, ``);
});

function openModalOverlay() {
    modalOverlay.classList.remove(`sec-modal-overlay-results`);
    modalOverlay.classList.add(`sec-modal-overlay-results-visible`);
}

closeOverlay.addEventListener(`click`, closeModalOverlay);
function closeModalOverlay() {
    modalOverlay.classList.remove(`sec-modal-overlay-results-visible`);
    modalOverlay.classList.add(`sec-modal-overlay-results`);
    clearAllMealData();
}

inputData.addEventListener(`focus`, clearError);
function clearError() {
    errorMessage.style.visibility = `hidden`;
    inputData.removeAttribute(`readonly`);
    clearAllMealData();
}

async function fetchMealData(mealName) {
    if (!mealName) {
        errorMessage.style.visibility = `visible`;
        return;
    }

    const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;
    try {
        let response = await fetch(apiURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        let data = await response.json();

        if (!data.meals) {
            errorMessage.style.visibility = `visible`;
            return;
        }

        printUIMain.innerHTML = "";
        data.meals.forEach(meal => {
            let mealImageElement = document.createElement('img');
            mealImageElement.setAttribute('src', meal.strMealThumb);
            mealImageElement.setAttribute('alt', meal.strMeal);
            mealImageElement.classList.add('meal-image');
            printUIMain.append(mealImageElement);

            let recipeResultContainer = document.createElement(`div`);
            recipeResultContainer.classList.add(`recipe-result-container`);
            recipeResultContainer.append(mealImageElement)

            let h2Element = document.createElement(`h2`);
            let recipeResultElement = document.createElement(`a`);
            recipeResultElement.setAttribute(`href`, `#`);
            recipeResultElement.textContent = meal.strMeal;
            
            h2Element.appendChild(recipeResultElement);
            recipeResultContainer.append(h2Element);
            printUIMain.append(recipeResultContainer);
            generalDiv.append(printUIMain);

            recipeResultElement.addEventListener(`click`, function () {
                openModalOverlay();
                displayMealDetails(meal);
            });
        });
    } catch (error) {
        errorMessage.style.visibility = `visible`;
        console.error(`Error fetching the meal:`, error.message);
    }
}

function displayMealDetails(meal) {
    mealNameDiv.innerHTML = `<h1>Meal:</h1><h2>${meal.strMeal}</h2>`;
    ingredientsDiv.innerHTML = `<h1>Ingredient Measurement:</h1>`;

    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            let item = document.createElement(`h3`);
            item.textContent = `${measure} ${ingredient}`;
            ingredientsDiv.appendChild(item);
        }
    }

    instructionsDiv.innerHTML = `<h1>Instructions:</h1>`;
    let instructionsList = document.createElement(`h4`);
    let instructionSteps = meal.strInstructions.split(`. `).filter(step => step.trim() !== "");

    instructionSteps.forEach((step, index) => {
        let listItem = document.createElement(`ul`);
        listItem.textContent = `${index + 1}. ${step}`;
        instructionsList.appendChild(listItem);
    });
    instructionsDiv.appendChild(instructionsList);
}

okBtn.addEventListener(`click`, clearAllMealData);
function clearAllMealData() {
    modalOverlay.classList.remove(`sec-modal-overlay-results-visible`);
    modalOverlay.classList.add(`sec-modal-overlay-results`);
    inputData.removeAttribute(`readonly`);
    mealNameDiv.innerHTML = "";
    ingredientsDiv.innerHTML = "";
    instructionsDiv.innerHTML = "";
    printUIMain.innerHTML = "";
}

modalOverlay.addEventListener(`click`, closeModalOverlay);

// Mobile Menu Toggle
menuToggle.addEventListener(`click`, () => {
    mobileMenuModal.classList.toggle(`menu-modal-visible`);
});

menuToggleClosed.addEventListener(`click`, () => {
    mobileMenuModal.classList.remove(`menu-modal-visible`);
});

heroDiv.addEventListener(`click`, () => {
    mobileMenuModal.classList.remove(`menu-modal-visible`);
});
