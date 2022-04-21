const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true,
        unique: true
    },
    includes:
    {
        type: String,
        required: true
    },
    description:
    {
        type: String,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    price:
    {
        type: Number,
        required: true
    },
    cookingTime:
    {
        type: Number,
        required: true
    },
    servings:
    {
        type: Number,
        required: true
    },
    caloriesPerServing:
    {
        type: Number,
        required: true
    },
    imageUrl: String,
    topMeal:
    {
        type: Boolean,
        default: false
    }
});

const mealModel = mongoose.model("meals", mealSchema);

module.exports = mealModel;