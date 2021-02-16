import React, {useState, useEffect} from "react";
const { months } = require("../../utils/constants")

const CalendarDisplay = ({calMonth, calYear, changeCalMonth, changeCalYear}) => {

  const updateMonth = direction => {
    if (calMonth === 0 && direction === 'prev') {
      changeCalMonth(11);
      changeCalYear(calYear - 1);
    } else if (calMonth === 11 && direction === 'next') {
      changeCalMonth(0);
      changeCalYear(calYear + 1);
    } else if (direction === 'prev') {
      changeCalMonth(calMonth - 1);
    } else if (direction === 'next') {
      changeCalMonth(calMonth + 1);
    }
  }

  return (
    <div>
      <button type="button" onClick={() => updateMonth('prev')}>⬅</button>
      {months[calMonth]} {calYear}
      <button type="button" onClick={() => updateMonth('next')}>➡</button>
    </div>
  )
}



export default CalendarDisplay
