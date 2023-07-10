require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const entry = require('./models/entry')
const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('request', function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request'))


let entries = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/info', (request, response) => {
  response
    .send(`
      <p>Phonebook has info for ${entries.length} people</p>
      <p>${Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entry => {
    response.json(entry)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(entry => {
      if (entry) {
        response.json(entry)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'name and/or number missing'
    })
  }
  
  const entry = new Entry({
    name: body.name,
    number: body.number,
  })
  
  entry.save().then(savedEntry => {
    response.json(savedEntry)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  
  const entry = {
    name: body.name,
    number: body.number
  }
  
  Entry.findByIdAndUpdate(request.params.id, entry, { new:true })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})