const express = require('express');
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./db/conn");
const hbs = require("hbs");
const user_registration = require("./models/user_register");
const async = require('hbs/lib/async');
const { send } = require('process');


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const tamplate_path = path.join(__dirname, "../tamplates/views");
const partial_path = path.join(__dirname, "../tamplates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", tamplate_path);
hbs.registerPartials(partial_path);

app.get('/', (req, res) => {
  res.status(200).render("index");

})

app.get('/registration', (req, res) => {
  res.render("registration");

})


app.post('/registration', async (req, res) => {
  try {

    const password = req.body.password;
    const cpassword = req.body.cpassword;



    if (password === cpassword) {
      var registere_userdoc = new user_registration({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        email: req.body.email,
        password: password,
        cpassword: cpassword,
        address: req.body.address
      }
      )

      const registered = await registere_userdoc.save();
      res.status(200).render("index");

    }

    else {
      res.status(201).send("Password is not matched");
    }
  } catch (error) {
    res.status(404).send(error);
  }

})

// login
app.get("/login", (req, res) => {
  res.status(201).render("login");
})

app.post('/login', async (req, res) => {
  try {

    const email = req.body.email;
    const password = req.body.password;
    const userdtl = await user_registration.findOne({ email: email });

    const ismatch = await bcrypt.compare(password, userdtl.password)

    if (ismatch) {
      res.status(200).render("index");
    } else {
      res.status(400).send("password not matched");
    }
  }
  catch (error) {
    res.status(400).send(" envalid login details");
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})