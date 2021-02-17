import React, {useState, useEffect} from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

const BudgetProgress = ({budget, monthlyTotal}) => {
  const [variant, setVariant] = useState('')
  const progress = Math.round((monthlyTotal / budget) * 100);

  useEffect(() => {
    if (progress >= 100) setVariant('danger');
    else if (progress >= 70) setVariant('warning')
    else setVariant ('')
    console.log(variant)
  }, [progress]);

  return (
    <ProgressBar
      now={progress}
      animated
      variant={variant}
      style={{margin: "20px 0 10px 0"}}
    />
  )
}

export default BudgetProgress
