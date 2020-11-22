import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from "react-bootstrap/InputGroup";

const NewExpense = ({handleChange, addExpense, val}) => {
  const [show, toggleShow] = useState(false);

  return (
    show ? (
      <InputGroup className="mb-3">
        <Button variant="outline-primary" onClick={() => toggleShow(!show)}>Collapse</Button>
        <InputGroup.Prepend>
          <Button variant="outline-primary" onClick={(e) => addExpense(e, val)}>Submit</Button>
        </InputGroup.Prepend>
          <input type="text" onChange={handleChange} value={val}/>
      </InputGroup>

    ) : (
      <Button variant="outline-primary" onClick={() => toggleShow(!show)}>New Expense</Button>
    )
  )
}

export default NewExpense
