import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contactsControllers.js';
import controllerWrapper from '../helpers/controllerWrapper.js';
import validateBody from '../helpers/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from '../schemas/contactsSchemas.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';

const contactsRouter = express.Router();

contactsRouter.get('/', authMiddlewares, controllerWrapper(getAllContacts));

contactsRouter.get('/:id', authMiddlewares, controllerWrapper(getOneContact));

contactsRouter.delete(
  '/:id',
  authMiddlewares,
  controllerWrapper(deleteContact)
);

contactsRouter.post(
  '/',
  authMiddlewares,
  validateBody(createContactSchema),
  controllerWrapper(createContact)
);

contactsRouter.put(
  '/:id',
  authMiddlewares,
  validateBody(updateContactSchema),
  controllerWrapper(updateContact)
);

contactsRouter.patch(
  '/:id/favorite',
  authMiddlewares,
  validateBody(updateStatusContactSchema),
  controllerWrapper(updateStatusContact)
);

export default contactsRouter;
