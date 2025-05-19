import express from 'express'
// import User from '../models/user.model';
import test from '../controllers/user.controller.js'

const router =express.Router();

router.get('/',test);
export default router;

