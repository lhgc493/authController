var mongoose = require('mongoose');
var validator = require('validator');
// var uniqueValidator = require('mongoose-unique-validator'); problemas con el patch
var bcrypt = require('bcryptjs');

var schema = mongoose.Schema;


var rolesValidos = {
    values: ['admin', 'presidente', 'tesoreria', 'secretaria', 'trabajador', 'residente', 'abastecimiento'],
    message: '{VALUE} no es un rol valido'
}

var usuarioSchema = new schema({

    nombre: { type: String, required: [true, 'Por favor dinos tu nombre!'] },
    correo: {
        type: String,
        required: [true, 'Por favor escribe tu correo!'],
        unique: [true, 'El correo debe ser único!'],
        lowercase: true,
        validate: [validator.isEmail, 'Por ingrese un correo valido! ']
    },
    password: { type: String, required: [true, 'La contraseña es obligatoria!'], minlength: [5, 'La contraseña debe tener 5 caracteres como mínimo! '], select: false },

    passwordConfirmar: {
        type: String,
        required: [true, 'Por favor confirma contraseña!'],
        validate: { validator: function(el) { return el === this.password }, message: 'Las contraseñas deben ser iguales!' },

    },
    passwordChangeAt: { type: Date },

    role: { type: String, required: true, default: 'residente', enum: rolesValidos },
    foto: { type: String, required: false }

});
// usuarioSchema.plugin(uniqueValidator, 'El {PATH} debe único!')
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirmar = undefined;
    next();
});

usuarioSchema.methods.cambioPasswordDespues = function(jwtTime) {
    if (this.passwordChangeAt) {
        var tiempo = parseInt(this.passwordChangeAt.getTime() / 1000, 10);
        console.log(tiempo, jwtTime);
        return jwtTime < tiempo;
    }

    return false;
}
module.exports = mongoose.model('Usuario', usuarioSchema);