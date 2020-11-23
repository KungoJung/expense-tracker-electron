import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
// import Calendar from "react-calendar";
// import DatePicker from '@bit/team-material.iclinic-material.date-picker';
import Calendar from "./CalendarContainer";
import {saveDataInStorage} from "../renderer.js";
const { categories } = require("../../utils/constants")

const defaultFormValue = {
  amount: '',
  description: '',
  category: 'Home'
}


const NewExpense = () => {
  const [show, toggleShow] = useState(false);
  const [formValues, setFormValue] = useState(defaultFormValue);
  const [date, setDate] = useState(new Date());

  // Manage state and input field
  const handleChange = (e) => {
    setFormValue({
      ...formValues,
      [e.target.name]: e.target.value
    })
  }

  // Send the input to main
  const addExpense = (e, expenseToAdd) => {
    e.preventDefault()
    saveDataInStorage(expenseToAdd)
    setFormValue(defaultFormValue)
    toggleShow()
  }

  return (
    show ? (
      <div>
        <Button variant="outline-primary" onClick={() => toggleShow(!show)}>Collapse</Button>
        <Form onSubmit={(e) => addExpense(e, {...formValues, date})}>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="text" name="amount" onChange={handleChange} value={formValues.amount} placeholder="Amount" />
          </InputGroup>
          <Form.Control type="text" name="description" onChange={handleChange} value={formValues.description} placeholder="Description" />
          <Form.Control as="select" name="category" onChange={handleChange} value={formValues.category} placeholder="Category">
            {categories.map((c, i) => (
              <option key={i}>{c}</option>
              ))}
          </Form.Control>
          <Calendar date={date} onChange={newDate => setDate(newDate)} />
          <Button variant="outline-primary" type="submit">Submit</Button>
        </Form>
      </div>
    ) : (
      <Button variant="outline-primary" onClick={() => toggleShow(!show)}>New Expense</Button>
    )
  )
}

export default NewExpense
