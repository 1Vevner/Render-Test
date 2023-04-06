const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//MIDDLEWARE
const requestLogger = (request, response, next) =>{
    console.log ('Method:   ', request.method)
    console.log ('Path:     ', request.path)
    console.log ('Body:     ', request.body)
    console.log ('---')
    next()
}

const unknownEndPoint = (request, response) =>{
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(express.json())
app.use(cors())
app.use(requestLogger)
app.use(morgan('tiny'))

const persons = [
    { 
        id: 1,
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: 2,
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: 4,
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

//GET
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get ('/api/persons', (request, response) => {
    response.json(persons)
})  

app.get ('/info', (request, response) => {
    const len = persons.length
    const date = new Date()
    console.log ("inside info")
    response.send(`
            <p>Phonebook has info for ${len} people</p>
            <p>${date}</p>
        `)
})

//REST GET
app.get ('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
        console.log ("get persons/id", id, person)
    } else {
        response.statusMessage = "404 Jayson is sleeping"
        response.status(404).end()
    }
})


//DELETE
app.delete('api/persons/:id',(request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id != id)
    response.status(204).end()
})

//POST
app.post ('api/persons/:id', (request, response) =>{
    //The json sent by the user
    const body = request.body
    //If the user sent data, name or number is empty
    if (!request.body || !body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    //Check if name already exists
    } else if (isExistent(body.name)) {
        return response.status(409).json({
            error: 'Name must be unique'
        })
    }
    //Create a new class person
    const person = {
        id: getNewID(),
        name: body.name, 
        number: body.number
    }
    //Concatinate and add new person to persons
    persons = persons.concat(person)
    //Respond back with the user sent json
    response.json(person)
})

//Modules
//Generate new ID from lenght of persons
const getNewID = () =>{
    const newID = persons.length > 0
        ? Math.max (... persons.map(person => person.id))
        : 0
    return newID + 1
} 

//See if name already exists
const isExistent = (name) =>{
    const exists = persons.find(person => person.name === name)
    if (exists) return true
    return false
}

app.use(unknownEndPoint)

//THIS RUNS IN PORT 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})