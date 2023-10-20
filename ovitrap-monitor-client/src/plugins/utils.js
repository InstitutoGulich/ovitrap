export function isMobile() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true
  } else {
    return false
  }
}
export function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

  return weekNo
}

export function getDateByWeek(year, week) {
  // compute date of monday of week with correct number
  var simple = new Date(year, 0, 1 + (week - 1) * 7, 0);
  var dow = simple.getDay();
  var date = simple;
  if (dow <= 4) date.setDate(simple.getDate() - simple.getDay() + 1);
  else date.setDate(simple.getDate() + 8 - simple.getDay());
  return date
}

export function getFirstMondayOfMonth(year, month) {
    var d = new Date(year, month, 0, 0, 0)
    d.setDate(1);

    // Get the first Monday in the month
    while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1);
    }

    return d
}

export function getMonthInLetters(index) {
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[index]
}

export function displayDate(date) {
  const d = new Date(date)
  return getMonthInLetters(d.getMonth()) + " " + d.getDate() + " " + d.getFullYear()  
}

export function displayDateDash(date) {
  return  date.getFullYear() + "-" + Math.round(date.getMonth()+1.0) + "-" + date.getDate()
}