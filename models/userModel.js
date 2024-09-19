import mongoose from "mongoose";
import bcrypt from "bcrypt";

const nameValidator = (name) => {
  const regex = /^[a-zA-Z\s]{2,50}$/;
  return regex.test(name);
};

const passwordValidator = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  return regex.test(password);
};

const emailValidator = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

const userSchema = new mongoose.Schema({
  workspace: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  name: {
    type: String,
    required: true,
    validate: {
      validator: nameValidator,
      message: "Name should contain only letters and be between 2 and 50 characters!",
    },
  },
  surname: {
    type: String,
    required: true,
    validate: {
      validator: nameValidator,
      message: "Surname should contain only letters and be between 2 and 50 characters!",
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: emailValidator,
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: passwordValidator,
      message:
        "Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one number.",
    },
  },
  avatar: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
