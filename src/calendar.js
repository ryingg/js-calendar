function Calendar(userOpts) {
  let opts = {
    container: null,
    mondayFirst: false,
    dayLabels: ['S','M','T','W','T','F','S'],
    monthLabels: ['January','Febuary','March','April','May','June','July','August','September','October','November','December'],
    onClick: (date, element) => {},
  }

  for (let opt in userOpts) {
    if (userOpts.hasOwnProperty(opt)) {
      opts[opt] = userOpts[opt]
    }
  }

  let calHeader = document.createElement('div')
  let calMonth = document.createElement('div')
  let prevButton = document.createElement('div')
  let nextButton = document.createElement('div')
  let calDate = new Date()

  this.init = function () {
    let container = document.querySelector(opts.container)
    let cal = document.createElement('div')
    let calBody = document.createElement('div')
    let calWeek = document.createElement('div')
    container.innerHTML = ''
    cal.className = 'cal'
    calHeader.className = 'cal-header'
    calBody.className = 'cal-body'
    calWeek.className = 'cal-week'
    calMonth.className = 'cal-month'
    prevButton.className = 'cal-prev-button'
    prevButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <path d="M20,0A20,20,0,1,0,40,20,20,20,0,0,0,20,0Zm-.25,17.61L16.59,20l3.16,2.4V25.5l-5.5-4.24v-2.5l5.5-4.26Zm6,0L22.59,20l3.16,2.4V25.5l-5.5-4.24v-2.5l5.5-4.26Z"/>
      </svg>
    `
    nextButton.className = 'cal-next-button'
    nextButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <path d="M0,20A20,20,0,1,0,20,0,20,20,0,0,0,0,20Zm20.25-5.5,5.5,4.26v2.5l-5.5,4.24V22.41L23.41,20l-3.16-2.4Zm-6,0,5.5,4.26v2.5l-5.5,4.24V22.41L17.41,20l-3.16-2.4Z"/>
      </svg>
    `
    calBody.appendChild(prevButton)
    calBody.appendChild(nextButton)
    calBody.appendChild(calWeek)
    calBody.appendChild(calMonth)
    cal.appendChild(calHeader)
    cal.appendChild(calBody)
    container.appendChild(cal)

    prevButton.addEventListener('click', function () { // init prev button listener
      calDate.setMonth(calDate.getMonth() - 1)
      initMonth()
    })
    nextButton.addEventListener('click', function () { // init next button listener
      calDate.setMonth(calDate.getMonth() + 1)
      initMonth()
    })

    for (let i = 0; i < 7; i++) { // init day labels
      let dayDiv = document.createElement('div')
      let daySpan = document.createElement('span')
      dayDiv.className = 'cal-day'

      if (opts.dayLabels[i]) {
        if (opts.mondayFirst) {
          if (i === 5 || i === 6) {
            daySpan.className = 'cal-day-weekend'
          }
          daySpan.innerHTML = opts.dayLabels[(i + 1) % 7]
        } else {
          if (i === 0 || i === 6) {
            daySpan.className = 'cal-day-weekend'
          }
          daySpan.innerHTML = opts.dayLabels[i]
        }
      }

      dayDiv.appendChild(daySpan)
      calWeek.appendChild(dayDiv)
    }

    initMonth()
  }

  const initMonth = function () {
    let year = calDate.getFullYear()
    let month = calDate.getMonth()
    let date = new Date(year, month, 1)
    calMonth.innerHTML = ''
    calHeader.innerHTML = opts.monthLabels[month] + ' ' + year // set label
    date.setDate(1 - (opts.mondayFirst ? (date.getDay() + 6) % 7 : date.getDay())) // first day - x days before month if 1 != Sun/Mon

    while ((month - date.getMonth() + 12) % 12 === 1) { // create days before month
      initDay(date)
      date.setDate(date.getDate() + 1)
    }
    
    while (date.getMonth() === month) { // create days in month
      initDay(date)
      date.setDate(date.getDate() + 1)
    }
  }

  const initDay = function (date) {
    let dateDiv = document.createElement('div')
    let dateSpan = document.createElement('span')
    let day = date.getDay()
    dateDiv.className = 'cal-date'
    dateDiv.setAttribute('data-calendar-date', date) // dataset.calendarDate

    if (date.getMonth() == calDate.getMonth()) { // current month
      dateDiv.addEventListener('click', function (event) {
        opts.onClick(this.dataset.calendarDate, this)
      })
      dateSpan.innerHTML = date.getDate()
    }

    if (day === 0 || day === 6) {
      dateSpan.className = 'cal-date-weekend'
    }

    dateDiv.appendChild(dateSpan)
    calMonth.appendChild(dateDiv)
  }

  this.init()
}