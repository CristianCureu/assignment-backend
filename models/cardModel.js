import mongoose from "mongoose";

const emailValidator = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

const cardSchema = new mongoose.Schema({
  process: { type: mongoose.Schema.Types.ObjectId, ref: "Process", required: true },
  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, unique: true, required: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: emailValidator,
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  phoneNumber: { type: String, required: true },
  phoneProvider: { type: String, required: true },
  description: { type: String, required: true },
  companyData: {
    companyName: { type: String, required: true },
    surname: { type: String, required: true },
    type: { type: String, enum: ["person", "company"], required: true },
  },
  gender: { type: String, enum: ["male", "female", "none"] },
  contractNumber: { type: String, unique: true, required: true },
  contractType: { type: String, enum: ["1 month", "6 months", "1 year"], required: true },
  startDate: { type: Date, default: Date.now },
  newContractDate: { type: Date },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
