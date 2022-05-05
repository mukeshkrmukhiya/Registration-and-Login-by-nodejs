const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user_register = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3
        },
        age: {
            type: Number,
            required: true,
            minlength: 3
        },
        gender: {
            type: String,
            required: true,
            minlength: 3
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid Email');
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 3
        },
        cpassword: {
            type: String,
            required: true,
            minlength: 3
        },
        address: {
            type: String,
            required: true,
            minlength: 3
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]

    }

)

user_register.methods.generateAuthToken = async function () {
    try {
        const token = await jwt.sign({ id: this.id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (error) {
        res.status(201).send("the eror is " + error);
        console.log("error is : " + error);
    }
}

user_register.pre("save", async function (next) {
    // const hassedPassword = await bcrypt.hash(password, 10);
    if (this.isModified("password")) {
        // console.log(`${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`${this.password}`);

        this.cpassword = await bcrypt.hash(this.password, 10);
        // this.cpassword = undefined;
    }
    next();
})

// new collection \

const User_registration = new mongoose.model('user', user_register)

module.exports = User_registration;