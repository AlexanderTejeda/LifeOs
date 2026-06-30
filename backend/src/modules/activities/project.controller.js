import * as projectService from './project.service.js'
import { ok, created } from '../../shared/utils/response.js'

export const list = async (req, res) => {
  ok(res, await projectService.list(req.user.id))
}

export const create = async (req, res) => {
  created(res, await projectService.create(req.user.id, req.body))
}

export const update = async (req, res) => {
  ok(res, await projectService.update(req.user.id, req.params.id, req.body))
}

export const remove = async (req, res) => {
  await projectService.remove(req.user.id, req.params.id)
  res.status(204).end()
}
