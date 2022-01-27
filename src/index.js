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

function getBalance(statement) {
    const balance = statement.reduce((acc, operation)=> {
        if(operation.type === 'credit') {
            acc + operation.amount;
        } 
        if(operation.type === 'debit') {
            acc - operation.amount;
        }
    }, 0);
    return balance;
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

app.get("/statement", verifyIfExisteAccountWhithCPF, (req, res) => {

    const {customer} = req;

    return res.send(customer.statement);
});

app.post("/statement/date", verifyIfExisteAccountWhithCPF, (req, res) => {
    const {customer} = req;
    const {date} = req.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter((statement) =>
        statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    );
    return res.send(statement);
});

app.post("/deposit", verifyIfExisteAccountWhithCPF, (req, res) => {

    const {amount, description} = req.body;

    const {customer} = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }
    customer.statement.push(statementOperation);
    return res.status(201).send();
});

app.post("/withdraw", verifyIfExisteAccountWhithCPF, (req, res) => {
    const {amount, description} = req.body;
    const {cusmoter} = req;
    const balance = getBalance(customer.statement);

    if(balance < amount) {
        return res.status(400).send({error: "Saldo insuficinte"})
    }
    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "debit"
    };
    customer.statement.push(statementOperation);

    return res.status(201).send();
})
app.listen(3333);