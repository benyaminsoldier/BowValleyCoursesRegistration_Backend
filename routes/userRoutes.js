import express from 'express'
import * as Controls from '../controller/controls.js'

export const router = express.Router()

router.post('/login', Controls.LoginUser)
router.post('/signin', Controls.SignInUser)
router.get('/programs', Controls.GetAllPrograms)
router.post('/addcourse', Controls.AddCourseToStudentList)