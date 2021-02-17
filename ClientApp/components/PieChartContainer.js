import React, {useState, useEffect} from 'react';
import { VictoryPie, VictoryTooltip } from "victory";
import accounting from "accounting";

const PieChartContainer = ({ expenses, setCategoryFilter, changeView, budget, setBudget, monthlyTotal }) => {
  const [categoryTotals, setCategoryTotals] = useState({});


  useEffect(() => {
    const totals = calculateTotals(expenses);
    setCategoryTotals(totals)
  }, [expenses])

  const data = Object.keys(categoryTotals).map((cat, i) => {
    return {y: categoryTotals[cat], label: `${cat}: ${accounting.formatMoney(categoryTotals[cat])}`, specialIdx: i, type: cat}
  })

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: "-20px"}}>
        <h4 style={{}}>Total: {accounting.formatMoney(monthlyTotal)}</h4>
        <h4>Monthly Budget: {accounting.formatMoney(budget)}</h4>
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
