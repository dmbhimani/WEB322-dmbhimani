const bcrypt = require("bcryptjs");
const express = require('express')
const userModel = require("../models/user");
const mealModel = require("../models/mealkit-db")
const router = express.Router();
const path = require("path");
const MealList = require("../models/mealkit-db");

router.get("/", function(req,res) {

    mealModel.find()
    .exec()
    .then(data => {
        data = data.map(value => value.toObject());
            
        res.render("general/home", {
            data: data
        });
    });
});

router.get("/menu", (req,res) => {

    mealModel.aggregate([
        {
            $set: {
                meal_info : {
                    imageUrl: "$imageUrl",
                    title: "$title",
                    includes: "$includes",
                    price: "$price"
                }
            }
        },
        {
            $group: {
                _id: "$category",
                items: {
                    $push: "$meal_info"
                }  
            }
        },
        {
            $project: {
                _id : 0,
                category: "$_id",
                items: 1
            }
        }
    ])

    .exec()
    .then(data => {
        if(data){

            res.render("general/onTheMenu", {
                items: data.items,
                data: data
            });
                
        }
        else{
            res.send("error loading model")
        }
    });
    
});

router.get("/registration",(req,res) => {
    res.render("general/registration");
});

router.post("/registration", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;
    
    let passedValidation = true;
    let validationMessages = {};
    let errors = [];

    if (typeof firstName !== 'string' || firstName.trim().length == 0) {
        // First name is not a string, or, first name is an empty string.
        passedValidation = false;
        validationMessages.firstName = "You must enter a first name";
    }

    else if (firstName.trim().length < 2) {
        // First name is not a string, or, name is less than two characters.
        passedValidation = false;
        validationMessages.firstName = "First name is too short";
    }

    else if (typeof lastName !== 'string' || lastName.trim().length == 0) {
        // Last name is not a string, or, last name is an empty string.
        passedValidation = false;
        validationMessages.lastName = "You must enter a last name";
    }

    else if (lastName.trim().length < 2) {
        // Last name is not a string, or, name is less than two characters.
        passedValidation = false;
        validationMessages.lastName = "Last name is too short";
    }

    else if (typeof email !== 'string' || email.trim().length == 0) {
        // email is not a string, or, email is an empty string.
        passedValidation = false;
        validationMessages.email = "You must enter a email";
    }

    else if (typeof password !== 'string' || password.trim().length == 0) {
        // password is not a string, or, password is an empty string.
        passedValidation = false;
        validationMessages.password = "You must enter a password";
    }

    else if (password.trim().length < 8 || password.trim().length > 12) {
        // password is not a string, or, password is an empty string.
        passedValidation = false;
        validationMessages.password = "Password should be between 8 to 12 characters";
    }

   
    if(passedValidation){

        const user = new userModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        });

        userModel.findOne({
            email: req.body.email
        })

        .then(user => {
            if(user){
                console.log("This email is already registered to Gourmet.");
                errors.push("This email is already registered to Gourmet.");
                res.render("general/registration", {
                    errors,
                    values: req.body
                });
            }
            else {
                user.save()
                .then((userSaved) => {
                    console.log(`User ${userSaved.firstName} has been added to the database.`);
                })
                .catch((err) =>{ 
                    console.log(`Error adding user to the database ... ${err}`);
                });

                const sgMail = require("@sendgrid/mail");
                sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

                const msg = {
                    to: {email},
                    from: "dmbhimani@myseneca.ca",
                    subject: "Gourmet",
                    html:
                        `Hello ${firstName} ${lastName},<br><br>
                        We are so glad you're here! <br><br>
                        Thanks you for your support and registering at Gourmet<br><br>
                        Checkout our socials for latest offers.<br><br><br>
                        Dhruvil Bhimani<br>
                        Gourmet<br>
                        `
                };

                sgMail.send(msg)
                .then(() => 
                {
                    req.session.user = user;
                    res.redirect("/welcome")
                })
            
                .catch(err => 
                {
                    console.log(`Error ${err}`);

                    res.render("general/registration", {
                    values: req.body,
                    validationMessages
                    });
            
                });
            }
        })
    }   

    else{
        res.render("general/registration",{
            values: req.body,
            validationMessages
        });
    }

});

router.get("/login",(req,res) => {
    res.render("general/signIn");
});

router.post("/login", (req, res) => {

    console.log(req.body);

    const { email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};
    let errors = [];

    
    if (typeof email !== 'string' || email.trim().length == 0) {
        // email is not a string, or, email is an empty string.
        passedValidation = false;
        validationMessages.email = "You must enter a email";
    }

    else if (typeof password !== 'string' || password.trim().length == 0) {
        // password is not a string, or, password is an empty string.
        passedValidation = false;
        validationMessages.password = "You must enter a password";
    }

    

    if(passedValidation){
        userModel.findOne({
            email: req.body.email
        })
    
        .then(user => {
            if(user){
                bcrypt.compare(req.body.password, user.password)
                .then(isMatched => {
                    if(isMatched){

                        if(req.body.SignType == 'customer') {
                            req.session.customer = user;
                            res.redirect("/welcome");
                        }
                        else if(req.body.SignType == 'employee'){
                            req.session.employee = user;
                            res.redirect("/load-data/meal-kits");
                        }
                        else{
                            res.render("general/signIn", {
                                values: req.body
                            });
                        }
                    }
                    else {
                        console.log("Passwords do not match.");
                        errors.push("Sorry, your password does not match our database.");
                        res.render("general/signIn", {
                            errors,
                            values: req.body
                        });
                    }
                })
            }
            else {
                console.log("User not found in the database.");
                errors.push("Email was not found in the database.");
                res.render("general/signIn", {
                    errors,
                    values: req.body
                });
            }
        })
    
        .catch(err => {
            // Couldn't query the database.
            console.log(`Error finding the user in the database ... ${err}`);
            errors.push("Oops, something went wrong.");
    
            res.render("general/signIn", {
                errors,
                values: req.body
            });
        });
    }   

    else{
        res.render("general/signIn",{
            values: req.body,
            validationMessages
        });
    }
});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    res.redirect("/login");
});



router.get("/welcome", ( req,res) => {
    if(req.session.customer){
        mealModel.find()
    .exec()
    .then(data => {
        data = data.map(value => value.toObject());
            
        res.render("general/welcome", {
            data: data
        });
    });
    }
    else {
        res.send("Sorry, You have to be logged in to access this page");
    }
});

router.get("/load-data/meal-kits", (req, res) => {
    if(req.session.employee){
        mealModel.find()
            .exec()
            .then(data => {
                data = data.map(value => value.toObject());
        
                res.render("general/dataClerk", {
                    data: data
                });
            });
    }
    else {
        res.send("Sorry, You have to be logged in to access this page");
    }
})

router.post("/load-data/meal-kits/addMeal", (req, res) => {

    const meal = new mealModel({
        title: req.body.title,
        includes: req.body.includes,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        cookingTime: req.body.cookingTime,
        servings: req.body.servings,
        caloriesPerServing: req.body.caloriesPerServing,
        topMeal: req.body.topMeal
    });

    meal.save()
    .then((mealSaved) => {
        console.log(`Meal ${mealSaved.title} has been added to the database.`);

        if(req.body.topMeal){
            meal.topMeal = true;
        }

        let uniqueName = `image-pic-${mealSaved._id}${path.parse(req.files.imageUrl.name).ext}`;

        req.files.imageUrl.mv(`public/images/${uniqueName}`)
        .then(() => {
            // Update the user document so that it includes the image URL.
            mealModel.updateOne({
                _id: mealSaved._id
            }, {
                imageUrl: uniqueName
            })
            .then(() => {
                console.log("Meal document was updated with the meal picture.");
                res.redirect("/load-data/meal-kits");
            })
            .catch(err => {
                console.log(`Error updating the meal's picture ... ${err}`);
                res.redirect("/load-data/meal-kits");
            })
        });
    })
    .catch((err) =>{ 
        console.log(`Error adding meal to the database ... ${err}`);
        res.render("general/dataClerk");
    });
                
})

router.post("/load-data/meal-kits/updateMeal", (req, res) => {

    if (req.body.title.trim().length === 0) {
        mealModel.deleteOne({
            title: req.body.title,
            includes: req.body.includes,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price
        })
        .exec()
        .then(() => {
            console.log("Successfully deleted the meal " + req.body.title);

            res.redirect("/load-data/meal-kits");
        });
    }
    else {

        mealModel.updateOne({
            title: req.body.title
        }, {
            $set: {
                title: req.body.title,
                includes: req.body.includes,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                cookingTime: req.body.cookingTime,
                servings: req.body.servings,
                caloriesPerServing: req.body.caloriesPerServing,
                imageUrl: req.body.imageUrl,
                topMeal: req.body.topMeal
            }
        })
        .exec()
        .then(() => {
            console.log("Successfully updated the meal " + req.body.title);

            // Redirect to home page.
            res.redirect("/load-data/meal-kits");
        });
    }
})

router.get("/mealkit/:info", (req, res) => {
    
    req.params.info = mealModel.find({title: 1})
    
    .exec()
    .then((meal) => {

        if(meal){

            mealModel.aggregate([
                {
                    $project: {
                        _id : 0,
                        imageUrl: 1,
                        title: 1,
                        price: 1,
                        includes: 1 
                    }
                }
            ])

            .exec()
            .then(data => {
                
                    if(data){
                res.render("general/shoppingCart", {
                    data: data
                });
            }
            });
            
        }
    })
})

module.exports = router;