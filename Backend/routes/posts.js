const express = require('express');
const checkAuth = require('../middleware/check-auth')
const Postcontroller= require('../controllers/post')

const router = express.Router();

const extractFile= require("../middleware/file")


router.post('', checkAuth, extractFile, Postcontroller.createPost );

router.put('/:id', checkAuth, extractFile ,Postcontroller.UpdatePost )

router.get("/:id", Postcontroller.getPosts )

router.get('',Postcontroller.getPost )

router.delete("/:id",checkAuth, Postcontroller.deletePost)

module.exports = router;