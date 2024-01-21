import { readFile, writeFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { nanoid } from 'nanoid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const contactsPath = resolve(__dirname, '../db/contacts.json')

const listContacts = async () => {
    const result = await readFile(contactsPath, 'utf-8')
    return JSON.parse(result)
}

const getContactById = async (id) => {
    const contacts = await listContacts()
    const result = contacts.find(contact => contact.id === id)
    return result || null
}

const addContact = async (name, email, phone) => {
    const contacts = await listContacts()
    const newContact = { id: nanoid(), name, email, phone }
    contacts.push(newContact)
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return newContact
}

const removeContact = async (id) => {
    const contacts = await listContacts()
    const index = contacts.findIndex(contact => contact.id === id)
    if (index === -1) return null
    const [result] = contacts.splice(index, 1)
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2))
    return result
}

const editContact = async (id, body) => {
    const contacts = await listContacts()
    const index = contacts.findIndex(contact => contact.id === id)
    if (index === -1) return null
    const [oldContact] = contacts.splice(index, 1)
    const newContact = {...oldContact, ...body}
    await writeFile(contactsPath, JSON.stringify([...contacts, newContact], null, 2))
    return newContact
}

export default { listContacts, getContactById, removeContact, addContact, editContact}