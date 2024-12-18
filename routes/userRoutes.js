import express from 'express'
import * as Controls from '../controller/controls.js'
import * as MiddleControls from '../controller/authMiddleware.js'

export const router = express.Router()

router.post('/login', Controls.LoginUser)
router.post('/signin', Controls.SignInUser)
router.get('/logout', MiddleControls.AuthorizeUserToken, Controls.LogOutUser)

router.get('/programs', Controls.GetAllPrograms)
router.post('/makepcrs', Controls.ProcessPCRS)

router.get('/mycourses/:studentID', MiddleControls.AuthorizeStudentToken, Controls.GetStudentCourses)
router.post('/addcourse/studentID/:studentID/courseCode/:courseCode', MiddleControls.AuthorizeStudentToken, Controls.AddCourseToStudentList)
router.delete('/dropcourse/:studentID', MiddleControls.AuthorizeStudentToken, Controls.DropCourseFromStudentList)

router.get('/getallpcrs', MiddleControls.AuthorizeAdminToken, Controls.GetAllPCRS)
router.get('/getallstudents', MiddleControls.AuthorizeAdminToken, Controls.GetAllStudents)
router.post('/createcourse', MiddleControls.AuthorizeAdminToken, Controls.CreateNewCourse)
router.put('/editcourse/:courseCode', MiddleControls.AuthorizeAdminToken, Controls.EditCourse)
router.delete('/deletecourse/:courseCode', MiddleControls.AuthorizeAdminToken, Controls.DeleteCourse )
