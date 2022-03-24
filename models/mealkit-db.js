var mealKits = [
    {
        title: "Sushi set nigiri",
        includes: "Special Teriyaki sauce",
        description: "Exotic Japanese taste sushi",
        category: "Classic Meal",
        price: 19.99,
        cookingTime: 35,
        servings: 2,
        caloriesPerServing: 545,
        imageUrl: "dish1.jpg",
        topMeal: true
    },
    {
        
        title: "Salmon goldfish platter",
        includes: "Carrots and Brocoli",
        description: "Roasted Salmon and goldfish with caviar",
        category: "Classic Meal",
        price: 16.99,
        cookingTime: 25,
        servings: 1,
        caloriesPerServing: 480,
        imageUrl: "dish2.jpg",
        topMeal: true
    },
    {
        
        title: "Raw beef salad",
        includes: "caesar dressing",
        description: "Raw beef meet meal with herbs salad",
        category: "Classic Meal",
        price: 12.99,
        cookingTime: 15,
        servings: 2,
        caloriesPerServing: 360,
        imageUrl: "dish3.jpg",
        topMeal: false
    },
    {
        
        title: "Classic pepperoni pizza",
        includes: "Feta cheese",
        description: "Pepperoni pizza with classic dough and feta cheese",
        category: "Classic Meal",
        price: 16.99,
        cookingTime: 30,
        servings: 4,
        caloriesPerServing: 430,
        imageUrl: "dish4.jpg",
        topMeal: false
    },
    {
        
        title: "English Pancakes",
        includes: "Strawberry toppings and syrup",
        description: "English style pancakes topped with strawberry and syrup",
        category: "Deserts",
        price: 9.99,
        cookingTime: 15,
        servings: 2,
        caloriesPerServing: 280,
        imageUrl: "dish5.jpg",
        topMeal: true
    },
    {
        
        title: "Fruit stuffed Crepes",
        includes: "Strawberry, blueberries, raspberry and bananas",
        description: "fresh fruit stuffed crepes with dust sugar coating",
        category: "Deserts",
        price: 14.99,
        cookingTime: 25,
        servings: 1,
        caloriesPerServing: 380,
        imageUrl: "dish6.jpg",
        topMeal: false
    }
];



module.exports.getTopMeals = function(){
    
    var topmeal = [];
    for (var i = 0; i < mealKits.length; i++){
        if(mealKits[i].topMeal){
            topmeal.push(mealKits[i]);
        }
    }
    
    return topmeal;
}