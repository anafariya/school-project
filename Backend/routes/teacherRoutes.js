import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { addTeacher,updateTeacher,deleteTeacher } from '../controllers/teacherController.js';
import { completeTeacherRegistration } from '../controllers/teacherController.js';
import {Role} from '../enum.js';
const router = express.Router();

router.get('/dashboard', authenticate, authorizeRoles(Role.Teacher), (req, res) => {
    res.json({ message:` Welcome Teacher: ${req.user.id}` });
});

router.post("/addTeacher",authenticate,authorizeRoles(Role.SchoolAdmin), addTeacher)
router.put("/updateTeacher/:id",authenticate,authorizeRoles(Role.SchoolAdmin), updateTeacher)
router.delete("/deleteTeacher/:id",authenticate,authorizeRoles(Role.SchoolAdmin), deleteTeacher)
router.post("/complete-registration", completeTeacherRegistration);

export default router;
