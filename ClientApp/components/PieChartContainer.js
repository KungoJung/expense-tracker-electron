import React, {useState, useEffect} from 'react';
import { VictoryPie, VictoryTooltip, VictoryLegend } from "victory";
import accounting from "accounting";

const PieChartContainer = ({ expenses }) => {
  const [categoryTotals, setCategoryTotals] = useState({});


  useEffect(() => {
    const totals = calculateTotals(expenses);
    setCategoryTotals(totals)
  }, [expenses])

  const data = Object.keys(categoryTotals).map(cat => {
    return {y: categoryTotals[cat], label: `${cat}: ${accounting.formatMoney(categoryTotals[cat])}`}
  })

  const totalSpent = Object.values(categoryTotals).reduce((acc, amt) => {
    return acc + amt
  }, 0)

  return (
    <div>
      <h4 style={{marginBottom: "-20px"}}>Total: {accounting.formatMoney(totalSpent)}</h4>
      <VictoryPie
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
            }
          }
        }]}
      />
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
