import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Day from './Day'

class Month extends PureComponent {
  chunkArray(arr, size) {
    let myArray = []
    for (let i = 0; i < arr.length; i += size) {
      myArray.push(arr.slice(i, i + size))
    }
    return myArray
  }

  renderMonth(month) {
    const {onSelect, scrollToSelectedDay, type} = this.props
    return month.map((day, index) =>
      <Day
        type={type}
        disabled={day.disabled}
        status={day.status}
        date={day.date}
        jalaliDate={day.jalaliDate}
        gregorianDate={day.gregorianDate}
        key={`${index}`}
        onSelect={onSelect}
        scrollToSelectedDay={scrollToSelectedDay}
      />
    )
  }

  render() {
    const {month, monthTitle, type} = this.props
    const isJalali = type === 'jalali'
    const monthArray = this.chunkArray(month, 7)
    return (
      <div className={`month-container ${isJalali ? 'month-container-jalali' : ''}`}>
        <div className='heading'>
          <span className='title'>{monthTitle}</span>
        </div>
        <div className='month'>
          {monthArray.map((monthChunk, index) => (
            <div className='row' key={`month--${index}`}>
              {this.renderMonth(monthChunk)}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Month.propTypes = {
  month: PropTypes.array,
  monthTitle: PropTypes.string,
  type: PropTypes.string,
  onSelect: PropTypes.func,
  scrollToSelectedDay: PropTypes.func
}

export default Month
