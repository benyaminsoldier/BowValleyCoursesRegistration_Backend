import express from 'express'
import * as dataModel from '../model/dataModel'

const router = express.router()

router.post('/login', loginUser)