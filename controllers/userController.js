const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userSchema");
// const complaint=require("../models/complaintSchema");

// register for citizen of india
const register = expressAsyncHandler(async (req, res) => {
  const { name, email, password, adharCardNumber } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    name,
    email,
    password: hashedPass,
    adharCardNumber,
  });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    adharCardNumber: user.adharCardNumber,
    role: user.role,
    token: generateJwt(user._id),
  });
});

// login for citizen, admin,officer,nodalOfficer
const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Enter all details");
  }
  const user = await userModel.findOne({
    email,
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      ...user._doc,
      token: generateJwt(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});

const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// admin can add new  officer || nodal-officer
const adminRegisterOfficier = expressAsyncHandler(async (req, res) => {
  const { role } = req.user;
  const { name, email, password, adharCardNumber } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  try {
    if (role == "admin") {
      const user = await userModel.create({
        name,
        email,
        password: hashedPass,
        adharCardNumber,
        role: "officer",
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        adharCardNumber: user.adharCardNumber,
        role: user.role,
        token: generateJwt(user._id),
      });
    } else {
      res.status(404).json("officer can only be add admin");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// admin now put designation to the officer
const putDesignation = expressAsyncHandler(async (req, res) => {
  const { post, dist, dept, email } = req.body;
  const { role } = req.user;

  try {
    const officer = await userModel.findOne({ email: email });
    if (officer && role == "admin" && officer.designation.length == 0) {
      officer.designation.push(post, dist, dept);
      await officer.save();

      res.status(200).json("admin added designation to the officer");
    } else {
      res.status(404).json("user is not admin or designation is already added");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// admin sell all the user whose role is officer
const allOfficerInAdminDashBoard = expressAsyncHandler(async (req, res) => {
  try {
    const { role } = req.user;
    const officer = await userModel.find({ role: "officer" });
    if (officer && role == "admin") {
      res.status(200).json(officer);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// remove a particular officer from database which is done by admin only
// const deleteOfficer=expressAsyncHandler(async(req,res)=>{
//   const id=req.params.id;
//   try{
//     await userModel.findByIdAndRemove(id);
//     res.status(200).json("officer is being deleted");
//   }catch(error){
//     res.status(500).json(error);
//   }
// })

// update the designation to empty array
const changeDesignation = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const { role } = req.user;
  try {
    const officer = await userModel.findOne({ email: email });
    if (officer && role == "admin") {
      officer.designation = [];
      await officer.save();

      res
        .status(200)
        .json(
          "admin change the designation of the particular officer into empty array"
        );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = {
  login,
  register,
  adminRegisterOfficier,
  putDesignation,
  allOfficerInAdminDashBoard,
  // deleteOfficer,
  changeDesignation,
};
