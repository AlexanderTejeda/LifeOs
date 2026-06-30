import { Router } from 'express'
import * as projectController from './project.controller.js'
import * as activityController from './activity.controller.js'
import { requireAuth } from '../../shared/middlewares/requireAuth.js'
import { validate, validateQuery } from '../../shared/middlewares/validate.js'
import {
  createProjectSchema,
  updateProjectSchema,
  createActivitySchema,
  updateActivitySchema,
  listActivitiesSchema,
} from './activities.validation.js'

const router = Router()

// Everything in this module requires a valid session.
router.use(requireAuth)

// Projects — declared before the activity `/:id` route so the literal path
// isn't captured as an activity id.
router.get('/projects', projectController.list)
router.post('/projects', validate(createProjectSchema), projectController.create)
router.patch('/projects/:id', validate(updateProjectSchema), projectController.update)
router.delete('/projects/:id', projectController.remove)

// Activities
router.get('/', validateQuery(listActivitiesSchema), activityController.list)
router.post('/', validate(createActivitySchema), activityController.create)
router.get('/:id', activityController.get)
router.patch('/:id', validate(updateActivitySchema), activityController.update)
router.delete('/:id', activityController.remove)

export default router
