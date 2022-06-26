import {UsernamePasswordInput} from '../resolvers/usernamePasswordInput'

export const validateRegister = (options: UsernamePasswordInput) => {
    if (options.username.length <= 2) {
        return {
            errors: [{
                field: 'username',
                message: 'username must be at least 3 characters'
            }]
        }
    }

    if (options.email.includes('@')) {  
        return {
            errors: [{
                field: 'email',
                message: 'not a valid email'
            }]
        }
    }

    if (options.password.length <= 2) {
        return {
            errors: [{
                field: 'password',
                message: 'password must be at least 3 characters'
            }]
        }
    }

    if (options.username.includes('@')) {
        return {
            errors: [{
                field: 'username',
                message: 'cannot include an @'
            }]
        }
    }
    return null
}