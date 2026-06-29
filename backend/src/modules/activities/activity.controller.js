import * as activityService from './activity.service.js'
import { ok, created } from '../../shared/utils/response.js'

export const list = async (req, res) => {
  ok(res, await activityService.list(req.user.id, req.validatedQuery))
}

export const get = async (req, res) => {
  ok(res, await activityService.get(req.user.id, req.params.id))
}

export const create = async (req, res) => {
  created(res, await activityService.create(req.user.id, req.body))
}

export const update = async (req, res) => {
  ok(res, await activityService.update(req.user.id, req.params.id, req.body))
}

export const remove = async (req, res) => {
  await activityService.remove(req.user.id, req.params.id)
  res.status(204).end()
}
