import { resourceService } from '../services/resourceService.js'

export function listResource(modelName) { return async (req, res) => res.json(await resourceService.list(modelName, {}, req.query)) }
export function getResource(modelName) { return async (req, res) => { const record = await resourceService.get(modelName, req.params.id); if (!record) return res.status(404).json({ message: 'Resource not found' }); res.json(record) } }
export function createResource(modelName) { return async (req, res) => res.status(201).json(await resourceService.create(modelName, req.body, req.user?.id)) }
async function ownedRecord(modelName, id, user) {
  const record = await resourceService.get(modelName, id)
  if (!record) return { error: 404 }
  const owner = record.author ?? record.user ?? record.requester
  if (user.role !== 'ADMIN' && (!owner || String(owner) !== user.id)) return { error: 403 }
  return { record }
}
export function updateResource(modelName) { return async (req, res) => { const found = await ownedRecord(modelName, req.params.id, req.user); if (found.error) return res.status(found.error).json({ message: found.error === 403 ? 'You are not allowed to modify this resource.' : 'Resource not found' }); const record = await resourceService.update(modelName, req.params.id, req.body); res.json(record) } }
export function deleteResource(modelName) { return async (req, res) => { const found = await ownedRecord(modelName, req.params.id, req.user); if (found.error) return res.status(found.error).json({ message: found.error === 403 ? 'You are not allowed to delete this resource.' : 'Resource not found' }); await resourceService.remove(modelName, req.params.id); res.status(204).end() } }
