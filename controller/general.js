const express = require('express')
const router = express.Router();

router.get("/headers", (req,res) => {
    const headers = req.headers;
    res.json(headers);
});

router.get("/menu", (req,res) => {
    res.render("onTheMenu");
});

router.get("/registration",(req,res) => {
    res.render("registration");
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

    else if (typeof firstName !== 'string' || firstName.trim().length < 2) {
        // First name is not a string, or, name is less than two characters.
        passedValidation = false;
        validationMessages.firstName = "First name is too short";
    }

    else if (typeof lastName !== 'string' || lastName.trim().length == 0) {
        // Last name is not a string, or, last name is an empty string.
        passedValidation = false;
        validationMessages.lastName = "You must enter a last name";
    }

    else if (typeof lastName !== 'string' || lastName.trim().length < 2) {
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


    if(passedValidation){
        res.send("Success");
    }   

    else{
        res.render("registration",{
            values: req.body,
            validationMessages
        });
    }
});

router.get("/login",(req,res) => {
    res.render("signIn");
});


module.exports = router;