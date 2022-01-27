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
    
    return res.send();
})

app.get("/statement/:cpf", (req, res) => {

    const {cpf} = req.params;
    const customer = customers.find(
        (customer) => customer.cpf === cpf
    );
    if(customer === undefined) {
        return res.status(400).send({error: "Customer not fund!"})
    } 
    return res.json(customer.statement)
});

app.listen(3333);