import React from 'react';
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button";

const ExpensesList = ({expenses, removeExpense, editExpense}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Expense</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((item, i) => {
          return (
            <tr key={i+1}>
              <td>{i+1}</td>
              <td>{item}</td>
              <td>
                <Button variant="outline-warning" onClick={() => editExpense(item)}>Edit</Button>{' '}
                <Button variant="outline-danger" onClick={() => removeExpense(item)}>Remove</Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default ExpensesList;
