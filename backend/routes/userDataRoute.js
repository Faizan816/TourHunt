const express = require("express");
const router = express.Router();
const userData = require("../models/userModel");

//CREATE
router.post("/", async (req, res) => {
  console.log(req.body);
  const { name, email, age } = req.body;
  try {
    const userAdded = await userData.create({
      name: name,
      email: email,
      age: age,
    });
    res.status(201).json(userAdded);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

//GET all the users 
router.get("/", async (req, res) => {
    try {
      const allUsers = await userData.find();
  
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


//GET single the users 
router.get("/:id", async (req, res) => {
    const {id}=req.params;
    try {
      const singleUser = await userData.findById({_id:id});
  
      res.status(200).json(singleUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  //delete single the users 
router.delete("/:id", async (req, res) => {
    const {id}=req.params;
    try {
      const singleUser = await userData.findByIdAndDelete({_id:id});
  
      res.status(200).json(singleUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });




module.exports = router;