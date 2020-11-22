import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {loadSavedData, saveDataInStorage, removeDatapointFromStorage, editDatapointInStorage} from "../renderer.js";
import ExpensesList from "./ExpensesList";
import NewExpense from "./NewExpense";
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA } = require("../../utils/constants")

const Home = () => {
  const [val, setVal] = useState("");
  const [pieView, changeView] = useState(true)
  const [expenses, setExpenses] = useState([]);

  // Grab the user's saved expenses after the app loads
  useEffect(() => {
    loadSavedData();
  }, []);

  // Listener functions that receive messages from main
  useEffect(() => {
    ipcRenderer.on(HANDLE_SAVE_DATA, handleNewExpense);
    // If we omit the next step, we will cause a memory leak and & exceed max listeners
    return () => {
      ipcRenderer.removeListener(HANDLE_SAVE_DATA, handleNewExpense);
    }
  });
  useEffect(() => {
    ipcRenderer.on(HANDLE_FETCH_DATA, handleReceiveExpensesFromMain);
    return () => {
      ipcRenderer.removeListener(HANDLE_FETCH_DATA, handleReceiveExpensesFromMain);
    }
  });

  // Receives all user expenses from main
  const handleReceiveExpensesFromMain = (event, data) => {
    if (data.error) {
      console.log(data.error)
    } else {
      console.log("renderer received data from main:", data.message);
      setExpenses([...data.message]);
    }
  };

  // Receives a new expense from main
  const handleNewExpense = (event, data) => {
    if (data.error) {
      console.log(data.error)
    } else {
      console.log("renderer received data from main:", data.message)
      setExpenses([...expenses, data.message])
    }
  }

  const handleChangeView = (event) => {
    changeView(!pieView)
  }

  // Manage state and input field
  const handleChange = (e) => {
    setVal(e.target.value)
  }

  // Send the input to main
  const addExpense = (e, input) => {
    e.preventDefault()
    saveDataInStorage(input)
    setVal("")
  }

  // Remove an expense
  const removeExpense = (expense) => {
    removeDatapointFromStorage(expense)
  }

  const editExpense = (expense) => {
    editDatapointInStorage(expense)
  }

  return (
    <div style={{"display": "flex", "flexDirection": "row", "margin": "5%"}}>
      <div style={{"display": "flex", "flexDirection": "column", "width": '70%', "marginRight": "5%"}}>
        <p>Placeholder for budget tracker</p>
        {/* {if in pie chart mode, show the following two:} */}
        {pieView ? (
          <p>Placeholder for pie chart and total spent this month</p>
        ) :
          expenses.length ? (
            <ExpensesList expenses={expenses} removeExpense={removeExpense} editExpense={editExpense}/>
          ) : (<p>Add an expense to get started</p>)
        }
      </div>
      <div style={{"display": "flex", "flexDirection": "column", "width": '30%'}}>
        <Button onClick={handleChangeView}>{pieView ? "View Expenses" : "Home"}</Button>
        <NewExpense handleChange={handleChange} addExpense={addExpense} val={val}/>
        {!pieView && <p>Placeholder for Category filter</p>}
      </div>
    </div>
  )
}

export default Home
