var Usuario = require('../models/usuarioModel');
var catchAsync = require('../utils/catchAsync');
var appError = require('../utils/appError');
var jwt = require('jsonwebtoken');
var body = require('body-parser');

exports.usuarioGet = async(req, res) => {

    var usuario = await Usuario.find();
    res.status(200).json({
        ok: true,
        usuario: usuario,

    })


}
exports.usuarioPost = catchAsync(async(req, res) => {
    body = req.body;

    var usuario = await Usuario.create(body);
    var token = jwt.sign({ id: usuario._id }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXP })
    res.status(200).json({
        ok: true,
        usuario: usuario,
        token: token
    })

});
exports.usuarioFindById = catchAsync(async(req, res, next) => {

    var id = req.params.id;
    var usuario = await Usuario.findById(id);

    if (!usuario) {
        var message = `Este ID : ${id} es invalido`;
        return next(new appError(message, 400))
    }

    res.status(200).json({
        ok: true,
        usuario: usuario
    })


});
exports.usuarioUpdate = catchAsync(async(req, res, next) => {
    body = req.body;
    var id = req.params.id;
    var usuario = await Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!usuario) {
        var message = `Este ID: ${id} no existe`
        return next(new appError(message, 404))
    }
    res.status(200).json({
        ok: true,
        usuario: usuario
    })
})
exports.UsuarioDelete = catchAsync(async(req, res) => {
    var id = req.params.id;
    var usuario = await Usuario.findByIdAndDelete(id);



    res.status(200).json({
        ok: true,
        usuario: null
    })


})