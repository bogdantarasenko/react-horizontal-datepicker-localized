import React from 'react';
import DatePicker from "./components/DatePicker";

function App() {
    const selectedDay = (val) =>{
        console.log(val)
    };

  return (
    <>
        <DatePicker getSelectedDay={selectedDay} labelFormat={"MMMM"} color={"#374e8c"}/>
    </>
  );
}

export default App;
