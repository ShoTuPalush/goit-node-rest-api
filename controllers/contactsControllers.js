import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const result = await contactsService.listContacts()
    res.json(result)
};

export const getOneContact = async (req, res) => {
    const { id } = req.params
    const result = await contactsService.getContactById(id)
    if (result === null) throw HttpError(404)
    res.json(result)
};

export const deleteContact = async (req, res) => {
    const { id } = req.params
    const result = await contactsService.removeContact(id)
    if (result === null) throw HttpError(404)
    res.json(result)
};

export const createContact = async (req, res) => {
    const {name, email, phone} = req.body
    const result = await contactsService.addContact(name, email, phone)
    res.status(201).json(result)
};

export const updateContact = async (req, res) => {
    const { id } = req.params
    if (Object.keys(req.body).length === 0) {
        throw HttpError(400, 'Body must have at least one field')
    }
    console.log(req.body);
    const result = await contactsService.editContact(id, req.body)
    if (result === null) throw HttpError(404)
    res.json(result)
};
