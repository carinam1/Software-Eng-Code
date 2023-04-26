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
                let selectedId = this.value;
                fetch("https://api.nal.usda.gov/fdc/v1/food/"+selectedId+"?api_key=vJbx4iLpZCsafpmVwdAFzQciR9a0LKp782rPLmYn")
                    .then(response => response.json())
                    .then(data => {
                        food = data;
                        let nutrients = data.foodNutrients;

                        calories = getNutrient(nutrients, 'Energy');
                        protein = getNutrient(nutrients, 'Protein');
                        fat = getNutrient(nutrients, 'Total lipid (fat)');
                        carbohydrate = getNutrient(nutrients, 'Carbohydrate, by difference');

                        container.innerHTML = `
                            <h2>${food.description}</h2>
                            <p>Calories: ${calories}</p>
                            <p>Protein: ${protein}</p>
                            <p>Fat: ${fat}</p>
                            <p>Carbohydrates: ${carbohydrate}</p>
                        `;

                        // Send the food data to the Cloud Function
                        sendFoodToDatabase(
                            food.description,
                            parseFloat(calories.split(' ')[0]),
                            parseFloat(protein.split(' ')[0]),
                            parseFloat(fat.split(' ')[0]),
                            parseFloat(carbohydrate.split(' ')[0])
                        );
                    });
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

function addToLogTable(foodId, foodName, calories, protein, fat, carbs) {
    const tableBody = document.getElementById("log-table-body");
    const row = tableBody.insertRow();
    
    row.dataset.foodId = foodId; // Add the foodId as a data attribute

    row.insertCell().innerHTML = foodName;
    row.insertCell().innerHTML = calories;
    row.insertCell().innerHTML = protein;
    row.insertCell().innerHTML = fat;
    row.insertCell().innerHTML = carbs;

    const removeButton = document.createElement("button");
    removeButton.innerHTML = "Remove";
    removeButton.onclick = function() {
        removeFromLog(row, calories, protein, fat, carbs);
    };
    const removeCell = row.insertCell();
    removeButton.onclick = async function () {
        await removeFromLog(row, foodId, calories, protein, fat, carbs);
      };      
    removeCell.className = "remove-cell";
    removeCell.appendChild(removeButton);
}

async function sendFoodToDatabase(foodName, calories, protein, fat, carbs) {
    const requestBody = {
      foodName,
      calories,
      protein,
      fat,
      carbs,
    };
  
    const response = await fetch("https://us-central1-nuyu-381420.cloudfunctions.net/addFood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  
    if (response.ok) {
      console.log("Food added successfully");
    } else {
      console.error("Error adding food to the database");
    }
  }

async function removeFoodFromDatabase(foodId) {
    const requestBody = {
      food_id: foodId,
    };
  
    const response = await fetch('https://us-central1-nuyu-381420.cloudfunctions.net/removeFood', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
  
    if (response.ok) {
      console.log('Food removed successfully');
    } else {
      console.error('Error removing food from the database');
    }
  }
  

  async function removeFromLog(row, foodId, calories, protein, fat, carbs) {
    dailyMacros.calories -= parseFloat(calories.split(" ")[0]);
    dailyMacros.protein -= parseFloat(protein.split(" ")[0]);
    dailyMacros.fat -= parseFloat(fat.split(" ")[0]);
    dailyMacros.carbohydrates -= parseFloat(carbs.split(" ")[0]);
  
    document.getElementById("daily-calories").innerHTML = `Total Daily Calories: ${dailyMacros.calories.toFixed(2)}`;
    document.getElementById("daily-protein").innerHTML = `Total Daily Protein: ${dailyMacros.protein.toFixed(2)} g`;
    document.getElementById("daily-fat").innerHTML = `Total Daily Fat: ${dailyMacros.fat.toFixed(2)} g`;
    document.getElementById("daily-carbohydrates").innerHTML = `Total Daily Carbohydrates: ${dailyMacros.carbohydrates.toFixed(2)} g`;
  
    try {
      await removeFoodFromDatabase(foodId);
      row.parentNode.removeChild(row);
    } catch (error) {
      console.error("Error removing food from the database");
    }
  }
  