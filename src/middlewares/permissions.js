"use strict"

// Middleware: permissions

module.exports = {

    isLogin: (req, res, next) => {

       
       

        // any User:
        if (req.user) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login.')
        }
    },

    isAdmin: (req, res, next) => {

      
        
        
        // only Admin:
        if (req.user && req.user.is_superadmin) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Admin.')
        }
    },

}