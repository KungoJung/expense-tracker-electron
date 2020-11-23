import React, {useState, useEffect} from 'react';
import { VictoryPie, VictoryTooltip } from "victory"

const PieChartContainer = ({ expenses }) => {
  const [categoryTotals, setCategoryTotals] = useState({})

  useEffect(() => {
    const totals = calculateTotals(expenses);
    setCategoryTotals(totals)
  }, [expenses])

  const data = Object.keys(categoryTotals).map(cat => {
    return {y: categoryTotals[cat], label: cat}
  })

  return (
    <div>
      <VictoryPie
        labelComponent={<VictoryTooltip/>}
        width={500}
        height={500}
        data={data}
        colorScale={["#87fcd1", "#5dccfb", "#fc87b2", "#f4ec6b",
        "#d88dd4", "#a7f6fe", "#dca58d", "#d55c88", "#bae1ff",  "#e27490"]}
      />
    </div>
  )
}

function calculateTotals(expenses) {
  return expenses.reduce((totals, currentExpense) => {
    let {category, amount} = currentExpense
    amount = Number(amount)
    totals[category] = (totals[category] ? totals[category] + amount : amount);
    return totals
  }, {})
}

export default PieChartContainer
