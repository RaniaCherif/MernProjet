const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require('express-validator');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');



module.exports.signUp = async (req, res) => {  
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { pseudo, email, password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ errors: { password: 'Le mot de passe doit faire 6 caractères minimum' } });
    }

    const newUser = await UserModel.findOne({ email });
    if (newUser) {
      return res.status(400).json({ errors: { email: 'Cet email est déjà enregistré' } });
    } else {
      const hashedPW = await bcrypt.hash(password, 10);
      const registredUser = new UserModel({
        pseudo,
        email,
        password: hashedPW,
      })
     
      const newRegistredUser = await registredUser.save()

      const token = jwt.sign({ id: newRegistredUser._id }, process.env.TOKEN_SECRET, {
        expiresIn: "10d",
      });
     
      res.status(201).json({ msg: "user created", token: token, user: newRegistredUser });
    }
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: { email: 'Email inconnu' } });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ errors: { password: 'Le mot de passe ne correspond pas' } });
      }

      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: "10d",
      });
      console.log(token);
      res.status(201).json({ msg: "login success", token: token, user: user });
    } catch (err){
      const errors = signInErrors(err);
      res.status(200).json({ errors });
    }
};


  module.exports.getUserData = async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: req.personID });
      if (!user) res.status(404).json({ msg: "user does not exist" });
      res.status(200).json({ msg: "user info success", person: user });
    } catch (error) {
      res.status(500).json({ msg: "something went wrong", error: error.message });
    }
  };