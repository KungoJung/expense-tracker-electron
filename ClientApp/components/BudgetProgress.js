import React from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

const BudgetProgress = () => {
  return (
    <div>
      <p>Placeholder for budget tracker. Sample:</p>
      <ProgressBar now={60} style={{marginBottom: "30px"}}/>
    </div>
  )
}

export default BudgetProgress
