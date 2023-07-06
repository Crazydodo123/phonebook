const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

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
  response.json(entries)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const entry = entries.find(entry => entry.id === id)
  
  if (entry) {
    response.json(entry)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  entries = entries.filter(entry => entry.id !== id)
  
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  const entry = {
    id: Math.floor(Math.random() * 100000),
    name: body.name,
    number: body.number
  }
  
  if (!body.name || !body.number) {
    response.status(400).json({
      error: 'name and/or number missing'
    })
  }
  
  if (entries.map(entry => entry.name).includes(body.name)) {
    response.status(400).json({
      error: 'name must be unique'
    })
  }
  
  entries = entries.concat(entry)
  response.json(entry)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})