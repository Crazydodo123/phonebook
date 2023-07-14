const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Peizhe:${password}@cluster0.xwjh17i.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = new mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  console.log('phonebook:')

  Entry.find({}).then(result => {
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
} else {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4],
  })

  entry.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}

