import * as categoryService from './category.service.js'
import { ok, created } from '../../shared/utils/response.js'

export const list = async (req, res) => {
  ok(res, await categoryService.list(req.user.id))
}

export const create = async (req, res) => {
  created(res, await categoryService.create(req.user.id, req.body))
}

export const update = async (req, res) => {
  ok(res, await categoryService.update(req.user.id, req.params.id, req.body))
}

export const remove = async (req, res) => {
  await categoryService.remove(req.user.id, req.params.id)
  res.status(204).end()
}
