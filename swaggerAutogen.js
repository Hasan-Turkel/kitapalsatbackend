"use strict"

require('dotenv').config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000
/* ------------------------------------------------------- */
const swaggerAutogen = require('swagger-autogen')()
const packageJson = require('./package.json')

const document = {
	info: {
		version: packageJson.version,
		title: packageJson.title,
		description: packageJson.description,
		termsOfService: "",
		contact: { name: packageJson.author, email: "mhturkel@gmail.com" },
		license: { name: packageJson.license, },
	},
	host: `${HOST}:${PORT}`,
	basePath: '/',
	schemes: ['http', 'https'],
	consumes: ["application/json"],
	produces: ["application/json"],
	securityDefinitions:[ {
		Token: {
			type: 'apiKey',
			in: 'header',
			name: 'authorization',
			description: 'JWT Token Authentication * Example: <b>Bearer ...tokenKey...</b>'
		},

	}],
	security: [{ Token: [] }],
	definition: {
		// Models:
		"User": require('./src/models/user').schema.obj,
		"Books": require('./src/models/books').schema.obj,
		"Messages": require('./src/models/messages').schema.obj,
	}
}

const routes = ['./index.js']
const outputFile = './src/configs/swagger.json'

// Create JSON file:
swaggerAutogen(outputFile, routes, document)