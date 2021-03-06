/* eslint radix: ["error", "as-needed"] */

export const getWeekNames = (type) => type === 'jalali'
  ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
  : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export const persianMonthsNames = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
]
export const gregorianMonthsNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
// export function getMonthName = ()

export function GtoJ(date) {
  let gy = date.getFullYear()
  const gm = date.getMonth() + 1
  const gd = date.getDate()
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
  let jy
  if (gy > 1600) {
    jy = 979
    gy -= 1600
  } else {
    jy = 0
    gy -= 621
  }
  const gy2 = gm > 2 ? gy + 1 : gy
  let days =
    365 * gy +
    parseInt((gy2 + 3) / 4) -
    parseInt((gy2 + 99) / 100) +
    parseInt((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1]
  jy += 33 * parseInt(days / 12053)
  days %= 12053
  jy += 4 * parseInt(days / 1461)
  days %= 1461
  if (days > 365) {
    jy += parseInt((days - 1) / 365)
    days = (days - 1) % 365
  }
  const jm =
    days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30)
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30)
  return [jy, jm, jd]
}

export function JtoG(jy, jm, jd) {
  let gy
  if (jy > 979) {
    gy = 1600
    jy -= 979
  } else {
    gy = 621
  }
  let days =
    365 * jy +
    parseInt(jy / 33) * 8 +
    parseInt(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186)
  gy += 400 * parseInt(days / 146097)
  days %= 146097
  if (days > 36524) {
    gy += 100 * parseInt(--days / 36524)
    days %= 36524
    if (days >= 365) days++
  }
  gy += 4 * parseInt(days / 1461)
  days %= 1461
  if (days > 365) {
    gy += parseInt((days - 1) / 365)
    days = (days - 1) % 365
  }
  let gd = days + 1
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ]
  let gm
  for (gm = 0; gm < 13; gm++) {
    const v = sal_a[gm]
    if (gd <= v) break
    gd -= v
  }
  return [gy, gm, gd]
}

function jLeapYear(year) {
  return ((((year % 33) % 4) - 1) === parseInt(((year % 33) * 0.05)))
}

function gMonthStart(date) {
  const gDate = GtoJ(date)
  const month = gDate[1]
  const year = gDate[0]
  const g = JtoG(year, month, 1)
  return new Date(g[0], g[1] - 1, g[2])
}

function gMonthEnd(date) {
  const gDate = GtoJ(date)
  const month = gDate[1]
  const year = gDate[0]
  const esfandDays = jLeapYear(year) ? 30 : 29
  const day = month < 7 ? 31 : month < 12 ? 30 : esfandDays
  const g = JtoG(year, month, day)
  const gDay = g[1] === 4 ? g[2] + 1 : g[2]
  return new Date(g[0], g[1] - 1, gDay)
}

export function generateMonths(count, startDate, selectFrom, selectTo, type) {
  const months = []
  const monthIterator = new Date(startDate)
  monthIterator.setDate(15)
  for (let i = 0; i < count; i++) {
    const month = getDates(monthIterator, type, startDate)
    if (month) {
      months.push(
        month.map(day => {
          if (day) {
            const jalaliDate = GtoJ(day)
            const gregorianDate = JtoG(jalaliDate[0], jalaliDate[1], jalaliDate[2])
            return {
              date: day,
              jalaliDate,
              gregorianDate,
              status: getStatus(day, selectFrom, selectTo),
              disabled:
                day.getTime() <
                new Date(startDate).setDate(startDate.getDate())
            }
          }
          return { date: '', status: 'monthFirstDays' }
        })
      )
    } else {
      count += 1
    }
    monthIterator.setMonth(monthIterator.getMonth() + 1)
  }
  return months
}

function getDates(date, type, startDate) {
  const month = date
  const isJalali = type === 'jalali'
  const monthStart = isJalali
    ? gMonthStart(month)
    : new Date(month.getFullYear(), month.getMonth(), 1)
  const monthEnd = isJalali
    ? gMonthEnd(month)
    : new Date(month.getFullYear(), month.getMonth() + 1, 0)
  startDate.setHours(12, 0, 0, 0)
  monthStart.setHours(12, 0, 0, 0)
  monthEnd.setHours(12, 0, 0, 0)
  if (startDate <= monthEnd) {
    const renderDate = new Date(monthStart)
    const allDates = []
    let delta
    while (renderDate.getTime() <= monthEnd.getTime()) {
      // Make empty objects to handle month first day exact weekday
      if (
        renderDate.getDate() === monthStart.getDate() &&
        allDates.length === 0
      ) {
        const weekDay = renderDate.getDay() + 1
        if (weekDay < 7) {
          delta = new Array(weekDay).fill(null)
          allDates.push(...delta)
        }
      }
      if (delta && allDates.length - delta.length > 30) {
        break
      }
      allDates.push(new Date(renderDate))
      // to avoid wrong Safari’s Daylight Saving Time calculations
      renderDate.setDate(renderDate.getDate() + 1)
    }
    return allDates
  }
}

export function getStatus(date, selectFrom, selectTo) {
  if ((selectFrom && !selectTo) || selectFrom === selectTo) {
    if (selectFrom.toDateString() === date.toDateString()) {
      return 'singleDate'
    }
  }
  if (selectFrom) {
    if (selectFrom.toDateString() === date.toDateString()) {
      return 'firstDay'
    }
  }
  if (selectTo) {
    if (selectTo.toDateString() === date.toDateString()) {
      return 'lastDay'
    }
  }
  if (selectFrom && selectTo) {
    if (selectFrom < date && date < selectTo) {
      return 'inRange'
    }
  }
  return 'common'
}
