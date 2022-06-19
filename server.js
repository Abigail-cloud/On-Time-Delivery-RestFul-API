const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const port = process.env.PORT || 8001;

const parcelsRoute = require('./routes/routes')
app.use('/', parcelsRoute)
    // use the express-static middleware
app.use(express.static("public"))
const path = require('path');
//The main Page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    //__dirname : Will resolve to your project folder.
});


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Swagger Document
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');


// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "On Time Delivery_Restful API",
            description: "User Parcel API Information",
            contact: {
                name: "Abigail Developer"
            },
            servers: ["http://localhost:8001"],
        }
    },
    // ['.routes/*.js']
    apis: ["server.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))


//Get all users get their parcels
/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * definitions:
 *   Signup:
 *     required:
 *       - Id
 *       - email
 *       - password
 *       - fisrtname
 *       - lastname
 *     properties:
 *       Id:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       firstname:
 *         type: string
 *       lastname:
 *         type: string
 *       path:
 *         type: string
 */


//User Signup
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * tags:
 *   - name: Signup
 *     description: Signup
 *   - name: Accounts
 *     description: Accounts
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     description: Signup to the application
 *     tags: [Users, Signup]
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters'
 *       - name: email
 *         description: User's email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: signup
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Signup'
 */


/**
 * @swagger
 * definitions:
 *   Login:
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       path:
 *         type: string
 */


//User Login
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User login
 */

/**
 * @swagger
 * tags:
 *   - name: Login
 *     description: Login
 *   - name: Account login
 *     description: Accounts logged
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login to the application
 *     tags: [Users, Login]
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/email'
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Login'
 */


/**
 * @swagger
 * /parcels:
 *  get:
 *    description: Get all parcels requested by users
 *    responses:
 *      '200':
 *        description: A successful response
 */


//Get parcelID
/**
 * @swagger
 * /parcels/parcelId:
 *  get:
 *    description: Get all the parcel-ids in each user parcels
 *    responses:
 *      '200':
 *        description: A successful response
 */

//Get parcels by user ID
/**
 * @swagger
 * /users/userId/parcels:
 *  get:
 *    description: Get all the parcel-ids in a user parcels
 *    responses:
 *      '200':
 *        description: A successful response
 */


/**
 * @swagger
 * definitions:
 *   Parcels:
 *     required:
 *       - name
 *       - amount
 *       - parcelId
 *     properties:
 *       name:
 *         type: string
 *       amount:
 *         type: integer
 *       parcelId:
 *         type: integer
 *       path:
 *         type: string
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User parcel creation
 */

/**
 * @swagger
 * tags:
 *   - name: Parcels
 *     description: Parcel Creation
 *   - name: Parcels
 *     description: Parcels
 */

/**
 * @swagger
 * /parcels:
 *   post:
 *     description: Parcel to be delivered
 *     tags: [Users, Parcel]
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/parameters/name/amount'
 *       - name: parcelId
 *         description: Parcel to be deliverd.
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Parcels
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Parcel'
 */

/**
 * @swagger
 * /parcels/parcelId/edit:
 *    put:
 *      description: Use to update parcel
 *    parameters:
 *      - name: parcelId
 *        in: query
 *        description: Edit the parcel with their Ids
 *        required: false
 *        schema:
 *          type: integer
 *          format: integer
 *    responses:
 *      '201':
 *        description: Successfully created user
 */

//Delete parcels by parcelId
/**
 * @swagger
 * /parcels/parcelId/cancel:
 *    delete:
 *      description: Delete parcel
 *    parameters:
 *      - name: parcelId
 *        in: query
 *        description: Delete the parcel with their Ids
 *        required: false
 *        schema:
 *          type: integer
 *          format: integer
 *    responses:
 *      '201':
 *        description: Deleted successfully 
 */




app.listen(port, () => console.log('The server is listening on ' + port));