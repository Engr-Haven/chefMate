let form = document.querySelector(`#form-field`)
let inputData = document.querySelector(`#meal-recipe`)
let printUIMain = document.querySelector(`#container-recipe-cont`)
let generalDiv = document.querySelector(`#general-container`)
let modalOverlay = document.querySelector(`#sec-modal-overlay-results`)
let closeOverlay = document.querySelector(`#close-icon`)
let mealNameDiv = document.querySelector(`#meal-name`)
let ingredientsDiv = document.querySelector(`#ingredients-measurement-container`)
let instructionsDiv = document.querySelector(`#instructions-container`)
let okBtn = document.querySelector(`#ok-btn`)
let errorMessage = document.querySelector(`#error-msg`)


form.addEventListener(`submit`, function(e) {
    e.preventDefault()
    fetchMealData()
    // This enables the inputfield to be locked. It won't take in data and won't submit data either (Other one like it is readonly - this will not totally be locked.)...and it should be the last line of action
    inputData.setAttribute(`readonly`, ``)
})

function openModalOverlay(){
    modalOverlay.classList.remove(`sec-modal-overlay-results`)
    modalOverlay.classList.add(`sec-modal-overlay-results-visible`)
}

closeOverlay.addEventListener(`click`, closeModalOverlay)
function closeModalOverlay(){
    if(modalOverlay.classList.contains(`sec-modal-overlay-results-visible`)){
        modalOverlay.classList.remove(`sec-modal-overlay-results-visible`)
        modalOverlay.classList.add(`sec-modal-overlay-results`)
    }

    clearAllMealData()
}

inputData.addEventListener(`focus`, clearError)
function clearError(){
    errorMessage.style.visibility = `hidden`
    inputData.removeAttribute(`readonly`)
}


let ingredients = []
let measurements = []


async function fetchMealData(){

    if(inputData.value.trim() === ``){
        errorMessage.style.visibility = `visible`
        return
    }

    const mealName = inputData.value.trim()
    const apiURL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    try{
        let response = await fetch(apiURL)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        let data = await response.json()

        let resultData = data.meals[0]
        let mealName = resultData.strMeal
        let instructData = resultData.strInstructions
        let mealImage = resultData.strMealThumb
    
        console.log(mealName);
        console.log(data);

        inputData.value = ``
        // this .blur() will remove the cursor after the user press the submit btn:
        inputData.blur()
    
        let mealImageElement = document.createElement('img')
        mealImageElement.setAttribute('src', mealImage)
        mealImageElement.setAttribute('alt', mealName)
        mealImageElement.classList.add('meal-image')

        // Append the image to the UI
        printUIMain.append(mealImageElement)

        let recipeResultContainer = document.createElement(`div`)
        recipeResultContainer.classList.add(`recipe-result-container`)

        let h2Element = document.createElement(`h2`)
        let recipeResultElement = document.createElement(`a`)
        recipeResultElement.setAttribute(`href`, `#`)
        recipeResultElement.setAttribute(`id`, `result-recipe`)
        recipeResultElement.textContent = mealName

        // Append:
        h2Element.appendChild(recipeResultElement)
        recipeResultContainer.append(h2Element)
        printUIMain.append(recipeResultContainer)
        generalDiv.append(printUIMain)


        recipeResultElement.addEventListener(`click`, openModalOverlay)

        // Modal-part >>
        let h1Element = document.createElement(`h1`)
        h1Element.textContent = `Meal:`
        let mealDescrip = document.createElement(`h2`)
        mealDescrip.textContent = `${h1Element, mealName}`

        // Append>>
        mealNameDiv.append(h1Element, mealDescrip)

        let ingreH1 = document.createElement(`h1`)
        ingreH1.textContent = `Ingredient Measurement:`
        
        ingredientsDiv.appendChild(ingreH1)

        for(let z = 1; z < 20; z++){
            let recipeIngredient = resultData[`strIngredient${z}`]
            let recipeMeasures = resultData[`strMeasure${z}`]
    
            if(recipeIngredient && recipeIngredient.trim() !==``){
                ingredients.push(recipeIngredient)
            }
            if(recipeMeasures && recipeMeasures.trim() !==``){
                measurements.push(recipeMeasures)
                let sentence = `${recipeMeasures} ${recipeIngredient}`

                
                let ingredientsDescrip = document.createElement(`h3`)
                ingredientsDescrip.textContent = sentence

                ingredientsDiv.appendChild(ingredientsDescrip)

                console.log(sentence);
            }
        }
        // let insrtH1 = document.createElement(`h1`)
        // insrtH1.textContent = `Instructions:`
        // let instructionsText = document.createElement(`h4`)
        // instructionsText.textContent = `${insrtH1, instructData}`

        // instructionsDiv.append(insrtH1, instructionsText)

        let insrtH1 = document.createElement(`h1`)
        insrtH1.textContent = `Instructions:`

        let instructionsList = document.createElement(`h4`) // Create a list element

        // Split the instructions by period followed by a space (". ") to separate steps
        let instructionSteps = instructData.split(`. `).filter(step => step.trim() !== ``)

        instructionSteps.forEach((step, index) => {
            let listItem = document.createElement(`ul`) // Create a list item
            listItem.textContent = `${index + 1}. ${step}` // Number each instruction correctly
            instructionsList.appendChild(listItem) // Append each step as a list item
        })

        // Append to the UI
        instructionsDiv.append(insrtH1, instructionsList)

        console.log(instructData);
    }catch(error){
        errorMessage.style.visibility = `visible`
        console.error(`Error fetching the meal:`, error.message)
    }
}


okBtn.addEventListener(`click`, clearAllMealData)
function clearAllMealData(){
    if(modalOverlay.classList.contains(`sec-modal-overlay-results-visible`)){
        modalOverlay.classList.remove(`sec-modal-overlay-results-visible`)
        modalOverlay.classList.add(`sec-modal-overlay-results`)
    }
    
    inputData.removeAttribute(`readonly`)

    mealNameDiv.textContent = ``
    ingredientsDiv.textContent = ``
    instructionsDiv.textContent = ``
    printUIMain.innerHTML = ``
}

modalOverlay.addEventListener(`click`, closeModalOverlay)

