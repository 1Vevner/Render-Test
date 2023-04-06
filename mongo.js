const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

const Person = mongoose.model('Person', personSchema)

const password = process.argv[2]    

const url =
    `mongodb+srv://shadowshakya:${password}@fullstackcluster.ba2p0xn.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
        console.log(person)
        })
        mongoose.connection.close()
    })      
}

if (process.argv.length > 3) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}