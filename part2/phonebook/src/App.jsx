import { useState, useEffect } from 'react'
import personService from './services/persons'
const Filter = ({ filter, onFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={onFilterChange} />
    </div>
  )
}

const PersonForm = ({ onSubmit, newName, onNameChange, newNumber, onNumberChange }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, onDelete }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={onDelete}>delete</button>
    </div>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.id} person={person} onDelete={() => onDelete(person)} />
      )}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
    
    useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

           const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }
        const personObject = {
      name: newName,
      number: newNumber
    }

        personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

    const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

    return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={handleFilterChange} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App