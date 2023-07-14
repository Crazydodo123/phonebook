const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (number) => {
        for (const letter of number) {
          if (!'1234567890-'.includes(letter)) return false
        }

        const parts = number.split('-')

        if (parts[0].length < 2 || parts[0].length > 3) return false
        if (parts.length > 2) return false
      },
      message: props => {return `${props.value} is not a valid number!`}
    }
  },
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)