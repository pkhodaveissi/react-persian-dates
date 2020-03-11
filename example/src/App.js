import React, { Component } from "react";
import ExampleComponent from "react-persian-dates";
import "react-persian-dates/src/Datepicker.css";

export default class App extends Component {
  render() {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
        {/* <div>
          <ExampleComponent
            onSelect={console.log}
            scrollToSelectedDay={day =>
              setTimeout(() => day.scrollIntoViewIfNeeded(), 1000)
            }
          />
        </div> */}
        <div>
          <ExampleComponent
            rangeSelect={true}
            startDate={new Date()}
            selectFrom={new Date()}
            selectTo={new Date()}
            onSelect={console.log}
              scrollToSelectedDay={day =>
                setTimeout(() => day.scrollIntoViewIfNeeded(), 1000)
              }
          />
        </div>
      </div>
    );
  }
}
