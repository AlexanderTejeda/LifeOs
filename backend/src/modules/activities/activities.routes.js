import { Router } from 'express'
import * as categoryController from './category.controller.js'
import * as activityController from './activity.controller.js'
import { requireAuth } from '../../shared/middlewares/requireAuth.js'
import { validate, validateQuery } from '../../shared/middlewares/validate.js'
import {
  createCategorySchema,
  updateCategorySchema,
  createActivitySchema,
  updateActivitySchema,
  listActivitiesSchema,
} from './activities.validation.js'

const router = Router()

router.use(requireAuth)

router.get('/categories', categoryController.list)
router.post('/categories', validate(createCategorySchema), categoryController.create)
router.patch('/categories/:id', validate(updateCategorySchema), categoryController.update)
router.delete('/categories/:id', categoryController.remove)

router.get('/', validateQuery(listActivitiesSchema), activityController.list)
router.post('/', validate(createActivitySchema), activityController.create)
router.get('/:id', activityController.get)
router.patch('/:id', validate(updateActivitySchema), activityController.update)
router.delete('/:id', activityController.remove)

export default router
