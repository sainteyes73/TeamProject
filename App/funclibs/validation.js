var util = require("util");

exports.errorHelper = function(err, cb) {
    //If it isn't a mongoose-validation error, just throw it.
    if (err.name !== 'ValidationError') return cb(err);
    var messages = {
        'required': "%s is required.",
        'min': "%s below minimum.",
        'max': "%s above maximum.",
        'enum': "%s not an allowed value.",
        'unique':"%s must be unique.",
        'regexp':"%s is not valid"
    };

    //A validationerror can contain more than one error.
    var errors = [];

    //Loop over the errors object of the Validation Error
    Object.keys(err.errors).forEach(function (field) {
        var eObj = err.errors[field];

        //If we don't have a message for `type`, just push the error through
        if (!messages.hasOwnProperty(eObj.kind)) errors.push(eObj.kind);

        //Otherwise, use util.format to format the message, and passing the path
        else errors.push(util.format(messages[eObj.kind], eObj.path));
    });

    return cb(errors);
}