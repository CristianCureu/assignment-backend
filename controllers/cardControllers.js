import Card from "../models/cardModel.js";
import Process from "../models/processModel.js";
import User from "../models/userModel.js";

export const getCardsByProcessId = async (req, res) => {
  const { processId } = req.params;
  const { offset = 0, limit = 10 } = req.query;

  try {
    const cards = await Card.find({ process: processId })
      .populate("process")
      .populate("projectManager")
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const totalCards = await Card.countDocuments({ process: processId });

    const formatedCards = cards.map((card) => ({
      _id: card.id,
      name: card.name,
      phoneNumber: card.phoneNumber,
      phoneProvider: card.phoneProvider,
      contractNumber: card.contractNumber,
      projectManager: card.projectManager,
      startDate: card.startDate,
    }));

    res.status(200).json({ success: true, cards: formatedCards, totalCards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCardById = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId)
      .populate("process")
      .populate("projectManager");

    if (!card) {
      res.status(400).json({ success: false, message: "Card not found." });
    }

    res.status(200).json({ success: true, card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCard = async (req, res) => {
  const { process, projectManager } = req.body;

  try {
    const existingProcess = await Process.findById(process);
    if (!existingProcess) {
      return res.status(400).json({
        success: false,
        message: "Invalid process. The referenced process does not exist.",
      });
    }

    const existingUser = await User.findById(projectManager);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid user. The referenced process does not exist.",
      });
    }

    const existingCard = await Card.findOne({ name: req.body.name });
    if (existingCard) {
      return res.status(400).json({
        success: false,
        message: `A card with name ${req.body.name} already exists!`,
      });
    }

    const newCard = await Card.create(req.body);

    res.status(201).json({ success: true, message: "Card created!", newCard });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const existingCard = await Card.findById(cardId);
    if (!existingCard) {
      return res.status(400).json({
        success: false,
        message: `Card doesn't exist.`,
      });
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);
    res.status(200).json({ success: true, message: "Card deleted!", deletedCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCard = async (req, res) => {
  const { cardId } = req.params;
  const {
    process,
    projectManager,
    name,
    email,
    phoneNumber,
    phoneProvider,
    description,
    companyData,
    gender,
    contractNumber,
    contractType,
    startDate,
    newContractDate,
  } = req.body;

  try {
    const existingCard = await Card.findById(cardId);
    if (!existingCard) {
      return res.status(400).json({
        success: false,
        message: `Card with ID ${cardId} doesn't exist.`,
      });
    }

    if (process) {
      const existingProcess = await Process.findById(process);
      if (!existingProcess) {
        return res.status(400).json({
          success: false,
          message: "Invalid process. The referenced process does not exist.",
        });
      }
    }

    if (projectManager) {
      const existingUser = await User.findById(projectManager);
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: "Invalid user. The referenced project manager does not exist.",
        });
      }
    }

    const updatedFields = {
      process: process || existingCard.process,
      projectManager: projectManager || existingCard.projectManager,
      name: name || existingCard.name,
      email: email || existingCard.email,
      phoneNumber: phoneNumber || existingCard.phoneNumber,
      phoneProvider: phoneProvider || existingCard.phoneProvider,
      description: description || existingCard.description,
      "companyData.companyName":
        companyData?.companyName || existingCard.companyData.companyName,
      "companyData.surname": companyData?.surname || existingCard.companyData.surname,
      "companyData.type": companyData?.type || existingCard.companyData.type,
      gender: gender || existingCard.gender,
      contractNumber: contractNumber || existingCard.contractNumber,
      contractType: contractType || existingCard.contractType,
      startDate: startDate || existingCard.startDate,
      newContractDate: newContractDate || existingCard.newContractDate,
    };

    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { $set: updatedFields },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Card updated!", updatedCard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
