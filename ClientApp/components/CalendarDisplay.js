import React, {useState, useEffect} from "react";
const { months } = require("../../utils/constants")
const leftArrow = require("../assets/left_arrow.png");
// const rightArrow = require("../assets/right_arrow.jpg");

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
    <div style={{height: '50px', width: '100%', fontSize: '2.2rem', fontWeight: 'bold', }}>
      <button type="button"
        onClick={() => updateMonth('prev')}
        style={{border: 'none', backgroundColor: 'white', marginRight: '25px'}}
        >
        <img src={leftArrow} style={{height: "35px", marginTop: '-5px'}}/>
      </button>
      {months[calMonth]} {calYear}
      <button type="button"
        onClick={() => updateMonth('next')}
        style={{border: 'none', backgroundColor: 'white', marginLeft: '25px'}}
        >
        <img src={leftArrow} style={{ height: "35px", 'WebkitTransform': 'scaleX(-1)', 'transform': 'scaleX(-1)', marginTop: '-5px'}}/>
        </button>
    </div>
  )
}



export default CalendarDisplay
