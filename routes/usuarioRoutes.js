var express = require('express');
var usuarioController = require('../controllers/usuarioController');

var router = express.Router();


router.route('/')
    .get(usuarioController.usuarioGet)
    .post(usuarioController.usuarioPost);
router.route('/:id')
    .get(usuarioController.usuarioFindById)
    .patch(usuarioController.usuarioUpdate)
    .delete(usuarioController.UsuarioDelete);


module.exports = router;