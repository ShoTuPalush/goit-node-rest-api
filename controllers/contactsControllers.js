import HttpError from '../helpers/HttpError.js';
import { Contact } from '../models/contacts.js';

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page, limit, favorite } = req.query;
  let obj = { owner };
  if (favorite !== undefined) {
    obj = { owner, favorite };
  }
  const skip = (page - 1) * limit;
  const result = await Contact.find(obj).skip(skip).limit(limit);

  if (result.length === 0) {
    throw HttpError(404);
  }
  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.find({ _id: id, owner }).catch(() => {
    throw HttpError(404);
  });
  if (result.length === 0) {
    throw HttpError(404);
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id: id, owner }).catch(
    () => {
      throw HttpError(404);
    }
  );
  if (result === null) {
    throw HttpError(404);
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  }).catch(() => {
    throw HttpError(404);
  });
  if (result === null) {
    throw HttpError(404);
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  }).catch(() => {
    throw HttpError(404);
  });
  if (result === null) {
    throw HttpError(404);
  }
  res.json(result);
};
