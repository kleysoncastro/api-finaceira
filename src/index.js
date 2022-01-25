const express = require('express');
const { send, status, sendStatus } = require('express/lib/response');
const {v4: uuidv4} = require("uuid");

customers = []

const app = express();
app.use(express.json());

app.post("/account", (req, res) => {
    const {cpf, name } = req.body;

    constAlreadyExist = customers.some(
        (customer) => customer.cpf === cpf
    );
    if (constAlreadyExist) {
        return res.status(400).json({
        error: "CPF já cadastrado"
        })
    }
   
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })
    console.log(customers)
    return res.status(201).send();
})

app.listen(3333);