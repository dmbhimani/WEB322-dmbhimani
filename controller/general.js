const express = require('express')
const userModel = require("../models/user");
const router = express.Router();
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
    
    if(passedValidation){

        
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
        res.render("general/welcome",{
            mealKits : topMealList.getTopMeals(),
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

module.exports = router;