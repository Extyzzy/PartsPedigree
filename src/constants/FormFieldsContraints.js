const passwordSimplified = {
    presence: {
        allowEmpty: false,
        message: 'can not be empty'
    },
    length: {
        minimum: 8,
        maximum: 32,
        message: 'length should be between 8 and 32'
    },
}
export default UserFields = {
    firstName: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        }
    },
    lastName: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        }
    },
    country: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        }
    },
    email: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        },
        email: {
            message: '^Enter valid email address'
        }
    },
    username: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        },
        length: {
            minimum: 4,
            message: 'length should be at least 4 chars'
        }
    },
    passwordSimplified: passwordSimplified,
    password1: {
        format: {
            pattern: ".*([0-9]+).*",
            message: "must contain at least one numeric character"
        }
    },
    password2: {
        format: {
            pattern: ".*[a-z]+.*",
            message: "must contain at least one lower character"
        }
    },
    password3: {
        format: {
            pattern: ".*[A-Z]+.*",
            message: "must contain at least one upper character"
        }
    },
    password4: {
        format: {
            pattern: ".*[\_\*\&\^\%\$\#\@\!\-\.\<\>\?\/]+.*",
            message: "must contain one special character such as _*&^%$#@!-.<>?/"
        }
    },
    confirmPassword: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        },
        equality: "password"
    },
    organization: {
        presence: {
            allowEmpty: false,
            message: 'can not be empty'
        }
    }
}