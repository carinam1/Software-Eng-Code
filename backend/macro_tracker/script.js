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

            select.onchange = function() {
                // Get the selected option's value
                let selectedId = this.value;
                let food;
                fetch("https://api.nal.usda.gov/fdc/v1/food/"+selectedId+"?api_key=vJbx4iLpZCsafpmVwdAFzQciR9a0LKp782rPLmYn")
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        food = data;
                        //let portions = data.foodPortions;
                        let nutrients = data.foodNutrients;
                        
                        let container = document.getElementById('data-container');
                        container.innerHTML = `
                            <h2>${food.description}</h2>
                        `;
                    })
                ;
                // Do something with the se lected option's value
                
            };
    })
    .catch(error => console.error(error));
}

function getNutrient(nutrientData, nutrientName){
    let temp = nutrientData.filter(a => a.nutrient.name == nutrientName)[0];
    if (temp != null) {
        temp = temp.nutrient;
        let output = temp.number + ' ' + temp.unitName;
        return output;
    }
    else{
        return '';
    }
}