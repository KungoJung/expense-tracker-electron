import React from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import accounting from "accounting";
import getMonth from 'date-fns/getMonth';
import getDate from 'date-fns/getDate';
import {removeDatapointFromStorage, editDatapointInStorage} from "../renderer.js";
const { months } = require("../../utils/constants");

const ExpensesList = ({expenses}) => {

  const removeExpense = (expense) => {
    removeDatapointFromStorage(expense)
  }

  // Not sure how to handle this on UI, doesn't work yet
  const editExpense = (expense) => {
    editDatapointInStorage(expense)
  }

  // Sort expenses by most recent
  const orderedExpenses = expenses.slice().sort((a,b) => {
    return new Date(b.date) - new Date(a.date)
  })

  return (
    <Table striped bordered hover>
      <tbody>
        {orderedExpenses.map((item) => {
          return (
            <tr key={item.id}>
              <td>{months[getMonth(new Date(item.date))].slice(0, 3)} {getDate(new Date(item.date))}</td>
              <td>{accounting.formatMoney(item.amount)}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>
                {/* future edit function */}
                {/* <Button variant="outline-warning" onClick={() => editExpense(item)}>Edit</Button>{' '} */}
                <Button variant="outline-danger" onClick={() => removeExpense(item.id)}>Remove</Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ExpensesList;
