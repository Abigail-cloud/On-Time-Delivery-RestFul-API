const express = require('express');
const routes = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'secret';
const List = require('../usersdata/user');
const userList = List.getUserList();
const Data = require('../usersdata/data');
const usersData = Data.getUsersData();



//Routes

//base path users
routes.get('/users', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'users',
        users: userList
    });
});

//User Signup
routes.post('/signup', async(req, res) => {
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

//User Login
routes.post('/login', async(req, res) => {
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

//Get Parcels from users.js
routes.get('/parcels', (req, res) => {

    let par = userList.map(({ parcel }) => parcel);
    res.status(200).send({
        success: 'true',
        message: 'parcel checked',
        parcels: par
    })
});


//Get parcelIds from parcel from user.js
routes.get('/parcels/parcelId', (req, res) => {
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
routes.get('/users/userId/parcels', (req, res) => {
    return res.status(200).send({
        success: 'true',
        message: 'parcel loading',
        user_parcels: userList[1].parcel
    })
});


//post parcels
routes.post('/parcels', (req, res) => {
    const { name, amount, parcelId } = req.body

    const parcelData = {
        name: name,
        amount: amount,
        parcelId: parcelId
    }
    userList[0].parcel.push(parcelData);
    res.status(200).json(userList);
});

//Update parcels
routes.put('/parcels/parcelId/edit', (req, res) => {
    console.log('put body', req.body);
    let parcelIndex = userList[0].parcel.findIndex((parcelAdded) => parcelAdded.id === req.body.parcelId);
    userList[0].parcel.splice(parcelIndex, 1, req.body);
    res.status(201).json(userList[0].parcel);
});

//Delete parcel by parcelId
routes.delete('/parcels/parcelId/cancel', (req, res) => {
    let userIndex = userList[0].parcel.findIndex(
        (deleteParcel) => deleteParcel.id === req.body.id
    );
    userList[0].parcel.splice(userIndex, 1);
    res.status(201).json(userList[0].parcel);
});

module.exports = routes;