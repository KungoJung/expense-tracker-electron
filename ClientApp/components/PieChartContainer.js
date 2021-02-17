import React, {useState, useEffect} from 'react';
import { VictoryPie, VictoryTooltip } from "victory";
import accounting from "accounting";

const PieChartContainer = ({ expenses, setCategoryFilter, changeView, budget, setBudget, monthlyTotal }) => {
  const [categoryTotals, setCategoryTotals] = useState({});
  const [editBudgetMode, toggleEditBudgetMode] = useState(false);
  const [budgetInput, changeBudgetInput] = useState(budget)

  const handleBudgetInput = e => {
    console.log("input:", e.target.value)
    changeBudgetInput(e.target.value)
  }

  useEffect(() => {
    const totals = calculateTotals(expenses);
    setCategoryTotals(totals)
  }, [expenses])

  const data = Object.keys(categoryTotals).map((cat, i) => {
    return {y: categoryTotals[cat], label: `${cat}: ${accounting.formatMoney(categoryTotals[cat])}`, specialIdx: i, type: cat}
  })

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: "-20px", fontSize: '1.5rem'}}>
        Total: {accounting.formatMoney(monthlyTotal)}
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
          Monthly Budget: {editBudgetMode
            ? <input name="budget-input" style={{marginLeft: '10px', width: '100px', fontSize: '1.2rem'}} type='number' value={budgetInput} onChange={handleBudgetInput}/>
            : `${accounting.formatMoney(budget)}`
          }
          {editBudgetMode && <button type="button" style={{marginLeft: '10px', fontSize: '1.2rem'}}
          onClick={() => {
            setBudget(budgetInput)
            toggleEditBudgetMode(!editBudgetMode)
          }
          }>Save</button>}
          <button type="button" style={{marginLeft: '10px', fontSize: '1.2rem'}} onClick={() => toggleEditBudgetMode(!editBudgetMode)}>{editBudgetMode ? 'X' : 'Edit'}</button>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', width: '85%', margin: '0 auto'}}>
        <VictoryPie
          style={{"width": "650px"}}
          labelComponent={<VictoryTooltip cornerRadius={2} flyoutStyle={{fill: "white"}}/>}
          data={data}
          colorScale={["#87fcd1", "#5dccfb", "#fc87b2", "#f4ec6b",
          "#d88dd4", "#a7f6fe", "#dca58d", "#d55c88", "#bae1ff",  "#e27490"]}
          events={[{
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "data",
                    mutation: () => ({style: {fill: "#007bff"}})
                  }, {
                    target: "labels",
                    mutation: () => ({ active: true })
                  }
                ];
              },
              onMouseOut: () => {
                return [
                  {
                    target: "data",
                    mutation: () => {}
                  }, {
                    target: "labels",
                    mutation: () => ({ active: false })
                  }
                ];
              },
              onClick: (e, clickedProps) => {
                const match = clickedProps.data.find(catObj => catObj.specialIdx === clickedProps.index)
                setCategoryFilter(match.type)
                changeView(false)
              }
            }
          }]}
        />
      </div>
    </div>
  )
}

// Helper function that reduces the entire expenses array, and returns the total for each category
function calculateTotals(expenses) {
  return expenses.reduce((totals, currentExpense) => {
    let {category, amount} = currentExpense
    amount = Number(amount)
    totals[category] = (totals[category] ? totals[category] + amount : amount);
    return totals
  }, {})
}

export default PieChartContainer
