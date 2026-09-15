import { dbModels } from '../models/index.js'

export const resourceService = {
  list: (modelName, filter = {}, { page = 1, limit = 20 } = {}) => dbModels[modelName].find(filter).limit(Math.min(Math.max(Number(limit), 1), 100)).skip((Math.max(Number(page), 1) - 1) * Math.min(Math.max(Number(limit), 1), 100)).sort({ createdAt: -1 }),
  get: (modelName, id) => dbModels[modelName].findById(id),
  create: (modelName, payload, userId) => dbModels[modelName].create({ ...payload, author: userId, user: userId }),
  update: (modelName, id, payload) => dbModels[modelName].findByIdAndUpdate(id, payload, { new: true, runValidators: true }),
  remove: (modelName, id) => dbModels[modelName].findByIdAndDelete(id),
}
