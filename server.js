const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'secret';
const port = process.env.PORT || 8001;
const List = require('./usersdata/user');
const userList = List.getUserList()
const Data = require('./usersdata/data');
const usersData = Data.getUsersData()
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
            servers: ["http://localhost:8001"]
        }
    },
    // ['.routes/*.js']
    apis: ["server.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

//Routes
/**
 * @swagger
 * /users:
 *  get:
 *    description: Use to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */
//base path users
app.get("/users", (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'users',
        users: userList
    });
});

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
 *       - $ref: '#/parameters/Id/email/lastname/firstame'
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: signup
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Signup'
 */
//User Signup
app.post('/signup', async(req, res) => {
    console.log('post body', req.body);
    const { email, password, firstName, lastName, id } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10)
    const data = {
        id: id,
        email: email,
        password: encryptedPassword,
        firstName: firstName,
        lastName: lastName
    }
    usersData.push(data);
    res.status(201).json(usersData);
});


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
//User Login
app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        res.status(400).send('Email and Passsword Required')
    }
    const usersIndex = usersData.findIndex((user) => user.email === email);
    //if user does not exist that is not part of the index
    console.log('userindex', usersIndex)
    if (usersIndex === -1) {
        res.status(400).send('User not found')
    }
    const user = usersData[usersIndex];
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ user_id: user.id, email: user.email }, secret, { expiresIn: '14d' })
        res.status(200).json(token);
    } else {
        res.status(403).send('Password mismatch')
    }
});

/**
 * @swagger
 * /parcels:
 *  get:
 *    description: Get all parcels requested by users
 *    responses:
 *      '200':
 *        description: A successful response
 */
//Get Parcels from users.js
app.get('/parcels', (req, res) => {

    let par = userList.map(({ parcel }) => parcel);
    res.status(200).send({
        success: 'true',
        message: 'parcel checked',
        parcels: par
    })
});

/**
 * @swagger
 * /parcels/parcelId:
 *  get:
 *    description: Get all the parcel-ids in each user parcels
 *    responses:
 *      '200':
 *        description: A successful response
 */
//Get parcelIds from parcel from user.js
app.get('/parcels/parcelId', (req, res) => {
    let parcelIds = [];
    for (let i = 0; i < userList.length; i++) {
        let currentUser = userList[i];
        for (let j = 0; j < currentUser.parcel.length; j++) {
            let currentParcel = currentUser.parcel[j];
            parcelIds.push(currentParcel['parcelId']);
        }
    }
    return res.status(200).send({
        success: 'true',
        message: 'parcelId Checked',
        parcel_ID: parcelIds
    });
});

/**
 * @swagger
 * /users/userId/parcels:
 *  get:
 *    description: Get all the parcel-ids in a user parcels
 *    responses:
 *      '200':
 *        description: A successful response
 */
//User ParcelId
app.get('/users/userId/parcels', (req, res) => {
    return res.status(200).send({
        success: 'true',
        message: 'parcel loading',
        user_parcels: userList[1].parcel
    })
});

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
//post parcels
app.post('/parcels', (req, res) => {
        const { name, amount, parcelId } = req.body

        const parcelData = {
            name: name,
            amount: amount,
            parcelId: parcelId
        }
        userList[0].parcel.push(parcelData);
        res.status(200).json(userList);
    })
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
    //Update parcels
app.put('/parcels/parcelId/edit', (req, res) => {
    console.log('put body', req.body);
    let parcelIndex = userList[0].parcel.findIndex((parcelAdded) => parcelAdded.id === req.body.parcelId);
    userList[0].parcel.splice(parcelIndex, 1, req.body);
    res.status(201).json(userList[0].parcel);
});
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
app.delete('/parcels/parcelId/cancel', (req, res) => {
    let userIndex = userList[0].parcel.findIndex((deleteParcel) => deleteParcel.id === req.body.id);
    userList[0].parcel.splice(userIndex, 1);
    res.status(201).json(userList[0].parcel);
});



app.listen(port, () => console.log('The server is listening on ' + port));