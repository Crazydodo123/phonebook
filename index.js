const express = require('express')
const app = express()

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

app.get('/info', (request, response) => {
  response
    .send(`
      <p>Phonebook has info for ${entries.length} people</p>
      <p>${Date()}</p>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})