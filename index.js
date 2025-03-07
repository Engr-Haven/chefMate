const newDataMeal = data.meals.map(item => {
    return{
        foodName : item.strMeal,
        foodInstruct : item.strInstructions
    }
})
console.log(newDataMeal);

const[firstArr, ...remArr] = newDataMeal
console.log(firstArr);
console.log(...remArr);