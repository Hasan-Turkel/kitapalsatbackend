"use strict"

const express = require('express')
const app = express()

/* ------------------------------------------------------- */
// Required Modules:

// envVariables to process.env:
require('dotenv').config()
const HOST = process.env?.HOST || '127.0.0.1'
const PORT = process.env?.PORT || 8000

// asyncErrors to errorHandler:
require("express-async-errors")

/* ------------------------------------------------------- */
// Configrations:

// Connect to DB:
const { dbConnection } = require('./src/configs/dbConnection')
dbConnection()

/* ------------------------------------------------------- */
// Middlewares:

// Accept JSON:
app.use(express.json())

const cors = require('cors');

app.use(cors({
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
      allowedHeaders: ['Content-Type', 'authorization', 'X-Requested-With' ], // İzin verilen başlıklar
      credentials: true,  // Preflight (OPTIONS) isteğini kontrol et
    }));

    app.options('*', cors());


// Check Authentication:
app.use(require('./src/middlewares/authentication'))


app.use(require('./src/middlewares/filterPaginate'))


/* ------------------------------------------------------- */
// Routes:

// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to IkinciElKitapAlSat',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        },
        user: req?.user
    })
})

// Routes:
app.use(require('./src/routes'))

/* ------------------------------------------------------- */

// errorHandler:
app.use(require('./src/middlewares/errorHandler'))


// RUN SERVER:
app.listen(PORT, () => console.log(`http://${HOST}:${PORT}`))

