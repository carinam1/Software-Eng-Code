let calories = '0 kcal';
let protein = '0 g';
let fat = '0 g';
let carbohydrate = '0 g';

let food;

function submitText() {
    var text = document.getElementById("input-box").value;

    fetch('https://api.nal.usda.gov/fdc/v1/foods/search?api_key=vJbx4iLpZCsafpmVwdAFzQciR9a0LKp782rPLmYn&query='+text)
        .then(response => response.json())
        .then(data => {
            // Display the results on the page
            let foods = data.foods;

            let select = document.getElementById('data-select');
            select.innerHTML = '';
            foods.forEach(item => {
                let option = document.createElement('option');
                option.value = item.fdcId;
                option.text = item.description;
                select.appendChild(option);
            });
            let container = document.getElementById('data-container');

            select.onchange = function() {
                // Get the selected option's value
                let selectedId = this.value;
                fetch("https://api.nal.usda.gov/fdc/v1/food/"+selectedId+"?api_key=vJbx4iLpZCsafpmVwdAFzQciR9a0LKp782rPLmYn")
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        food = data;
                        //let portions = data.foodPortions;
                        let nutrients = data.foodNutrients;
                        
                        // Get nutrient values
                        calories = getNutrient(nutrients, 'Energy');
                        protein = getNutrient(nutrients, 'Protein');
                        fat = getNutrient(nutrients, 'Total lipid (fat)');
                        carbohydrate = getNutrient(nutrients, 'Carbohydrate, by difference');
                
                        // Update container's innerHTML
                        container.innerHTML = `
                            <h2>${food.description}</h2>
                            <p>Calories: ${calories}</p>
                            <p>Protein: ${protein}</p>
                            <p>Fat: ${fat}</p>
                            <p>Carbohydrates: ${carbohydrate}</p>
                        `;
                    })
                ;
            };
    })
    .catch(error => console.error(error));
}

function getNutrient(nutrientData, nutrientName) {
    let temp = nutrientData.filter(a => a.nutrient.name === nutrientName)[0];
    if (temp) {
        let output = temp.amount + ' ' + temp.nutrient.unitName;
        return output;
    } else {
        return 'Not available';
    }
}

function addToLogTable(foodName, calories, protein, fat, carbs) {
    const tableBody = document.getElementById("log-table-body");
    const row = tableBody.insertRow();
    
    row.insertCell().innerHTML = foodName;
    row.insertCell().innerHTML = calories;
    row.insertCell().innerHTML = protein;
    row.insertCell().innerHTML = fat;
    row.insertCell().innerHTML = carbs;
}
