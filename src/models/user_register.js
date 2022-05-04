const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
        }


    }

)

user_register.pre("save", async function (next) {
    // const hassedPassword = await bcrypt.hash(password, 10);
    if (this.isModified("password")) {
        console.log(`${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`${this.password}`);

        this.cpassword = undefined;
    }
    next();
})

// new collection \

const User_registration = new mongoose.model('user', user_register)

module.exports = User_registration;