import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import {loadSavedData} from "../renderer.js";
import BudgetProgress from "./BudgetProgress"
import ExpensesList from "./ExpensesList";
import NewExpense from "./NewExpense";
import PieChartContainer from "./PieChartContainer";
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
const { ipcRenderer } = require("electron");
const { HANDLE_FETCH_DATA, HANDLE_SAVE_DATA, months } = require("../../utils/constants")

const Home = () => {

  const [pieView, changeView] = useState(true)
  const [expenses, setExpenses] = useState([]);

  // Incorporate budget later:
  const [budget, setBudget] = useState(0)

  // Incorporate this later for filtering for each month -- months are index 0:
  const [calMonth, changeCalMonth] = useState(getMonth(new Date()));
  const [calYear, changeCalYear] = useState(getYear(new Date()));

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

  const handleChangeView = () => {
    changeView(!pieView)
  }

  return (
    <div style={{"display": "flex", "flexDirection": "row", "margin": "5%"}}>
      <div style={{"display": "flex", "flexDirection": "column", "width": '70%', "marginRight": "5%"}}>
        <h4>{"⬅"} {months[calMonth]} {calYear} {"➡"}</h4>
        <BudgetProgress />
        {/* {if in pie chart mode, show the following two:} */}
        {pieView ? (
          <PieChartContainer expenses={expenses} />
        ) :
          expenses.length ? (
            <ExpensesList expenses={expenses} />
          ) : (<p>Add an expense to get started</p>)
        }
      </div>
      <div style={{"display": "flex", "flexDirection": "column", "width": '30%'}}>
        <Button onClick={handleChangeView} style={{marginBottom: "15px"}}>{pieView ? "View Expenses" : "Home"}</Button>
        <NewExpense />
        {!pieView && <p>Placeholder for Category filter</p>}
      </div>
    </div>
  )
}

export default Home
