const User = require('../models/users');

//importing bcrypt
const bcrypt = require("bcrypt");

const validator = require('validator')
//importing jsonwebtoken
const jwt = require('jsonwebtoken');

//Creating a Token to give access to users to user services
//user id and user's role is passed with token
const createToken = (_id, role, name) => {
    console.log(process.env.SECRET)
   return  jwt.sign({_id, role, name}, process.env.SECRET, {expiresIn: '60m'})
}


//signup function
const signUp = async (req, res, next) => {

  const { name, mobile, email, address, password, role } = req.body;
console.log(name, mobile, email, address, password, role)
  //validation for all the input fields
  if (!name || !mobile || !email || !address || !password) {
    throw Error('All fields must be filled')
  }

  
  //checking wheather password is valid or not
  if (!validator.isEmail(email)) {
    throw Error('Email not valid')
  }

  let existingUser;
  //chaecking whether user already sign up or not based on the email
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exist...login instead " })
  }

  const salt = await bcrypt.genSalt(6)
  //hashsync is a function that can hasing the password
  const hashedpassword = await bcrypt.hash(password, salt);


  //creating a new User
  const user = new User({
    name,
    mobile,
    email,
    address,
    password: hashedpassword,
    role: role || "buyer"
  });

  try {
    await user.save();//saving document(a new user to) into DB

        const token = createToken(user._id, user.role, user.name) //calling to createToken function to create a token for user


        //Create and setting a cookie with the user's ID and token
        res.cookie("token", token, {
          path: "/",
          expires: new Date(Date.now() + 1000 * 60 * 30),
          httpOnly: true,
          sameSite: "lax"
        })

    res.status(201).json({ message: "user succesfully registered", User:user, token })//sending the new user details with token as a message for the response
  } catch (err) {
    console.log(err);
    throw new Error('Error saving user');
  }

}


//login function
const login = async (req, res, next) => {

  const { email, password } = req.body;

  //checking whether pasword and login fields are filled or not 
  if (!email || !password) {
    throw Error('All fields must be filled')
  }

  let loggeduser;

  //check whether user is exist on the db, based on the email
  try {
    loggeduser = await User.findOne({ email: email })

  } catch (err) {
    return new Error(err);
  }

  //if user is noth found in the db
  if (!loggeduser) {
    return res.status(400).json({ message: "User not found.Sign up please" })
  }

  //checking password and comare it with exist user's password in the db
  const isPasswordCorrect = bcrypt.compareSync(password, loggeduser.password);

  //if password and email are invalid
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid email/password" })
  }
  //calling to createToken function to create a token for user
  const token = createToken(loggeduser._id, loggeduser.role)

  //Create and setting a cookie with the user's ID and token
  res.cookie("token", token, {
    path: "/",
    expires: new Date(Date.now() + 1000*60*60),
    httpOnly:true,
    sameSite:"lax"
  })


  //we send this msg along with the token and user details
  return res.status(200).json({ message: "Successfully logged in", User: loggeduser, token })

}


//gets own profile details  
const getUser = async (req, res, next) => {
  const userid = req.userId;//gets user Id from the token
  let user;

  //console.log("user ID (get USER)" + userid)

  try {
    //find the password with userId
    user = await User.findById(userid, "-password"); //this minus operator is used to restrict getting user password.But other details will get                                                     
  } catch (err) {
    return new Error(err)
  }

  //if user not found return this message
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }
  return res.status(200).json({ user });//if user is exist
}
const getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};



//get all the users
const getUsers = async (req, res, next) => {
  let users;

  //find all the users
  try {
    users = await User.find({});
  } catch (err) {
    console.log(err)
  }

  //if users are not in db
  if (!users) {
    res.status(404).json({ message: "There are no Users added" })
  }
  else {
    res.status(200).json({ users })//display users if there are users
  }

}


//logout function
const logout = (req, res, next) => {
  // Clear the cookie
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Successfully logged out" });
};


//delete Acc

const deleteUser = async(req, res) =>{
  try{
    await User.findByIdAndDelete(req.userId)

  res.clearCookie("token");
req.cookies["token"] = ""
    res.json({message:"Account deleted successfully!!"})
  }catch(err){
    console.log(err)
    res.status(500).json({message:"Error in deleting you account"})
  }
}


//update Acc
const updateProfile = async (req, res, next) => {
  const userId = req.userId;
  const { name, mobile, email, address } = req.body;

  // Only require these fields
  if (!name || !mobile || !email || !address) {
    return res.status(400).json({ message: "All fields must be filled" });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Email not valid' });
  }

  // Check if email is used by another user
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database error" });
  }

  if (existingUser && existingUser._id.toString() !== userId) {
    return res.status(400).json({ message: "This email is already exists. Use a different email." });
  }

  // Update user
  let user;
  try {
    user = await User.findByIdAndUpdate(
      userId,
      { name, mobile, email, address },
      { new: true }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating user" });
  }

  if (!user) {
    return res.status(404).json({ message: "Unable to Update by id" });
  }
  return res.status(200).json({ user });
};

const updatePassword = async (req, res) => {
  const userId = req.userId; // set by auth middleware
  const { oldPassword, newPassword } = req.body;

  // Validate input
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Both old and new password are required.' });
  }

  // Fetch user
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  // Verify old password
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect.' });

  // Hash and update
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  user.password = hashed;
  await user.save();

  return res.status(200).json({ message: 'Password updated successfully.' });
};
      // Set seller (restaurant) availability
const setAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const { isAvailable } = req.body;
    // Only allow sellers to update this
    const user = await User.findById(userId);
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Not authorized" });
    }
    user.isAvailable = isAvailable;
    await user.save();
    res.json({ message: "Availability updated", isAvailable: user.isAvailable });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get seller (restaurant) info including availability
const getSellerInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId, "-password");
    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json({
      name: user.name,
      isAvailable: user.isAvailable,
      email: user.email,
      address: user.address,
      mobile: user.mobile
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.signUp = signUp;
exports.login = login;
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.logout = logout;
exports.deleteUser = deleteUser;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;
exports.setAvailability = setAvailability;
exports.getSellerInfo = getSellerInfo;

