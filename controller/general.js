const bcrypt = require("bcryptjs");
const express = require('express')
const userModel = require("../models/user");
const router = express.Router();
const path = require("path");
const topMealList = require("../models/mealkit-db");

router.get("/", function(req,res) {
    res.render("general/home", {
        mealKits : topMealList.getTopMeals()
    });
});

router.get("/menu", (req,res) => {
    res.render("general/onTheMenu");
});

router.get("/registration",(req,res) => {
    res.render("general/registration");
});

router.post("/registration", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;
    
    let passedValidation = true;
    let validationMessages = {};

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

    const user = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    user.save()
        .then((userSaved) => {
            console.log(`User ${userSaved.firstName} has been added to the database.`);
        })
        .catch((err) =>{ 
            console.log(`Error adding user to the database ... ${err}`);
    });
    
    if(passedValidation){

        

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

        const msg = {
            to: {email},
            from: "dmbhimani@myseneca.ca",
            subject: "Thanks for registering at Gourmet",
            html:
                `Full Name: ${firstName} ${lastName}<br>
                Email Address: ${email}<br>
                `
        };

        sgMail.send(msg)
        .then(() => 
        {
            res.render("general/welcome",{
                mealKits : topMealList.getTopMeals(),
            });
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

                        req.session.user = user;

                        res.render("general/welcome",{
                            mealKits : topMealList.getTopMeals(),
                        });
                    }
                    else {
                        console.log("Passwords do not match.");
                        errors.push("Sorry, your password does not match our database.");
                        res.render("general/signIn", {
                            errors
                        });
                    }
                })
            }
            else {
                console.log("User not found in the database.");
                errors.push("Email was not found in the database.");
                res.render("general/signIn", {
                    errors
                });
            }
        })
    
        .catch(err => {
            // Couldn't query the database.
            console.log(`Error finding the user in the database ... ${err}`);
            errors.push("Oops, something went wrong.");
    
            res.render("general/signIn", {
                errors
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

router.get("/welcome",(req,res) => {
    res.render("general/welcome",{
        mealKits : topMealList.getTopMeals(),
    });
});

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    res.render("general/signIn");
});

module.exports = router;