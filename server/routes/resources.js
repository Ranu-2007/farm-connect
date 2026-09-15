import { Router } from 'express'
import { createResource, deleteResource, getResource, listResource, updateResource } from '../controllers/resourceController.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

export function resourceRoutes(path, modelName, options = {}) {
  const router = Router()
  router.get('/', listResource(modelName))
  router.get('/:id', getResource(modelName))
  router.post('/', requireAuth, ...(options.roles ? [requireRole(...options.roles)] : []), createResource(modelName))
  router.put('/:id', requireAuth, ...(options.roles ? [requireRole(...options.roles)] : []), updateResource(modelName))
  router.delete('/:id', requireAuth, ...(options.roles ? [requireRole(...options.roles)] : []), deleteResource(modelName))
  return { path, router }
}
