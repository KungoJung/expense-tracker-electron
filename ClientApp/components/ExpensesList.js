import React from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";
import accounting from "accounting";
import {removeDatapointFromStorage, editDatapointInStorage} from "../renderer.js";

const ExpensesList = ({expenses}) => {

  const removeExpense = (expense) => {
    removeDatapointFromStorage(expense)
  }

  const editExpense = (expense) => {
    editDatapointInStorage(expense)
  }

  return (
    <Table striped bordered hover>
      {/* <thead>
        <tr>
          <th>Date</th>
          <th>Amt</th>
          <th>Description</th>
          <th>Category</th>
        </tr>
      </thead> */}
      <tbody>
        {expenses.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.date}</td>
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
