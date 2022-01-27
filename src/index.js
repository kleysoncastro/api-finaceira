const express = require('express');
const { send, status, sendStatus } = require('express/lib/response');
const {v4: uuidv4} = require("uuid");

customers = []

const app = express();
app.use(express.json());

function verifyIfExisteAccountWhithCPF(req, res, next) {
    const {cpf} = req.headers;

    customer = customers.find(
        (customer) =>  customer.cpf === cpf);
        if(!customer) {
            return res.status(400).send({error: "Customer not fund!"})
        } 

        req.customer = customer;
      return  next();
}

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

app.get("/statement",verifyIfExisteAccountWhithCPF, (req, res) => {

    const {customer} = req;

    return res.send(customer.statement);
});

app.listen(3333);