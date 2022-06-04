const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'secret';
const PORT = process.env.PORT || 8001;
import { getUserList } from './user';
const userList = getUserList();
import { getUsersData } from './data'
const usersData = getUsersData();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Get all users for base path
app.get("/users", (req, res) => {
    return res.status(200).send({
        success: "true",
        message: "users",
        users: userList,
    });
});

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
    res.status(200).json(usersData);
});

//User Login

app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    if (!(email && password)) {
        req.status(400).send('Email and Passsword Required')
    }
    const usersIndex = usersData.findIndex(user => user.email === email)
        //if user does not exist that is not part of the index
    console.log('userindex', usersIndex)
    if (usersIndex === -1) {
        res.status(400).send('User not found')
    }
    const user = usersData[usersIndex]
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ user_id: user.id, email: user.email }, secret, { expiresIn: '14d' })
        res.status(200).json(token);
    } else {
        res.status(403).send('Password mismatch')
    }
});
//Get Parcels from users.js
app.get('/parcels', (req, res) => {
    return res.status(200).send({
        success: 'true',
        message: 'parcel checked',
        parcels: userList.map(({ parcel }) => parcel),
    });
});


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

//User ParcelId
app.get('/users/userId/parcels', (req, res) => {
    return res.status(200).send({
        success: 'true',
        message: 'parcel loading',
        user_parcels: userList[1].parcel
    })
});

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

//Update parcels
app.put('/parcels/parcelId/edit', (req, res) => {
    console.log('put body', req.body)
    let parcelIndex = userList[0].parcel.findIndex(parcelAdded => parcelAdded.id === req.body.parcelId)
    userList[0].parcel.splice(parcelIndex, 1, req.body);
    res.status(201).json(userList[0].parcel)
})

app.delete('/parcels/parcelId/cancel', (req, res) => {
    let userIndex = userList[0].parcel.findIndex((deleteParcel) => deleteParcel.id === req.body.id);
    userList[0].parcel.splice(userIndex, 1);
    res.status(201).json(userList[0].parcel);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => console.log('The server is listening on ' + PORT));