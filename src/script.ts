/* global moment */

const form: HTMLFormElement | null = document.querySelector('#form')

// DOM Node Anchors and main listener
if(form) {
  form.addEventListener('submit', (e) => {
    interface FormNodes {
      nameField: HTMLInputElement | null,
      carYear: HTMLInputElement| null,
      carMake: HTMLInputElement| null,
      carModel: HTMLInputElement| null,
      startDate: HTMLInputElement| null,
      duration: HTMLInputElement| null,
      creditCard: HTMLInputElement| null,
      ccv: HTMLInputElement| null,
      expiration: HTMLInputElement| null
    }
    const inputNodes: FormNodes = {
      nameField: document.querySelector('#name'),
      carYear: document.querySelector('#car-year'),
      carMake: document.querySelector('#car-make'),
      carModel: document.querySelector('#car-model'),
      startDate: document.querySelector('#start-date'),
      duration: document.querySelector('#duration'),
      creditCard: document.querySelector('#credit-card'),
      ccv: document.querySelector('#cvv'),
      expiration: document.querySelector('#expiration')
    }
    removeWarnings(inputNodes)

    const errors: string[] = validateForm(inputNodes)
    const errorsSet: string[] = [...new Set(errors)]

    if (errors.length > 0) {
      e.preventDefault()
      setDisplay(errorsSet)
      console.log(errorsSet)
    } else if (inputNodes.duration && inputNodes.startDate){
      e.preventDefault()
      const cost: number = calculateCost(inputNodes.duration.value, inputNodes.startDate.value)
      setDisplay([`Total: $${cost}`])
      console.log(cost)
    }
  })
}

// UI Modifiers
function invalidatedClass (node) {
  return node.classList.contains('warn') ? console.log('already marked') : node.classList.add('warn')
}

function badEntryClass (node) {
  return node.classList.contains('bad-entry') ? console.log('already marked') : node.classList.add('bad-entry')
}

function removeWarnings (allNodes) {
  for (const node in allNodes) {
    if (allNodes[node].classList.contains('warn')) {
      allNodes[node].classList.remove('warn')
    }

    if (allNodes[node].classList.contains('bad-entry')) {
      allNodes[node].classList.remove('bad-entry')
    }
  }
}

function setDisplay (errorsSet) {
  const list = document.querySelector('#error-list')
  const container = document.querySelector('#error-box')

  list.innerHTML = ''
  let listItems = ''
  for (const error of errorsSet) {
    listItems += `<li>${error}</li>`
  }
  list.innerHTML = listItems
  container.classList.remove('invisible')
}

// INDIVIDUAL VALIDATION FUNCTIONS
function checkEmpties (nodes) {
  const err = []
  for (const node in nodes) {
    if (nodes[node].value === '') {
      invalidatedClass(nodes[node])
      err.push('All Fields Required')
    }
  }
  return err
}

function checkYear (carYear) {
  // Must be Number, After 1900, Not Future
  const value = carYear.value
  const thisYear = moment().format('YYYY')
  const err = []
  let msg = ''

  if (value === '') {
    return err
  }

  if (isNaN(carYear.value)) {
    msg += 'Car Year Must be a Numerical Value'
  } else if (value < 1900 || value > parseInt(thisYear)) {
    msg === '' ? msg = `Car Year Must be Between 1900 and ${thisYear}` : msg += ` Between 1900 and ${thisYear}`
  }

  if (msg !== '') {
    err.push(msg)
    badEntryClass(carYear)
  }
  return err
}

function checkDate (startDate) {
  // Must be future date
  const err = []
  const enteredDate = startDate.value

  if (enteredDate !== '' && moment().isAfter(enteredDate, 'day')) {
    err.push('Start Date Must be in the Future')
    badEntryClass(startDate)
    console.log('Date in Past')
  }

  return err
}

function checkDuration (duration) {
  // Must be between 1 and 30
  const err = []
  const value = duration.value

  if (value === '') {
    return err
  }

  if (value < 1 || value > 30) {
    err.push('Duration Must be Between 1 and 30 Days')
    badEntryClass(duration)
  }

  return err
}

function checkCCV (ccv) {
  // Only 3 digit numbers
  const err = []
  const value = ccv.value

  if (value === '') {
    return err
  }
  if (isNaN(value) || value.length !== 3) {
    err.push('CCV Must be a 3-Digit Numerical Value')
    badEntryClass(ccv)
  }
  return err
}

function checkCreditCard (creditCard) {
  const err = []
  const value = creditCard.value.replace(/\s+/g, '')
  if (value === '') {
    return err
  }

  if (!validateCardNumber(value)) {
    badEntryClass(creditCard)
    err.push('Invalid Credit Card Number')
  }

  return err
}

function checkExpiration (expiration) {
  // Must be a valid month and year, Date must not be in past
  const err = []
  const value = expiration.value
  const regEx = new RegExp('^(0[1-9]|1[0-2])/?([0-9]{2})$')

  if (value === '') {
    return err
  }

  if (!regEx.test(value)) {
    err.push('Please Enter Expiration Date in "MM/YY" Format')
    badEntryClass(expiration)
    return err
  }

  const splitValue = value.split('/')
  const expDateMoment = moment(`${splitValue[0]} ${splitValue[1]}`, 'MM YY')

  if (moment().isAfter(expDateMoment, 'month')) {
    badEntryClass(expiration)
    err.push('Credit Card Expired')
  }

  return err
}

// MAIN VALIDATOR
function validateForm (inputNodes) {
  let errorAccumulator = []

  errorAccumulator = errorAccumulator.concat(
    checkEmpties(inputNodes),
    checkYear(inputNodes.carYear),
    checkDate(inputNodes.startDate),
    checkDuration(inputNodes.duration),
    checkCCV(inputNodes.ccv),
    checkCreditCard(inputNodes.creditCard),
    checkExpiration(inputNodes.expiration)
  )
  return errorAccumulator
}

// CC Support Functions
function validateCardNumber (number) {
  // Checks CC against regular expression
  var regex = new RegExp('^[0-9]{16}$')
  if (!regex.test(number)) {
    return false
  } else {
    return luhnCheck(number)
  }
}

function luhnCheck (val) {
  // Checks to make sure that the numbers match an agreed upon pattern for credit cards (sum of odds + sum of doubled and modified evens %10 should equal 0)
  var sum = 0
  for (var i = 0; i < val.length; i++) {
    var intVal = parseInt(val.substr(i, 1))
    if (i % 2 === 0) {
      intVal *= 2
      if (intVal > 9) {
        intVal = 1 + (intVal % 10)
      }
    }
    sum += intVal
  }
  return (sum % 10) === 0
}

// COST CALCULATOR
function calculateCost (duration, startDate) {
  let cost = 0
  for (let i = 0; i <= duration; i++) {
    const evalDate = moment(startDate).add(i, 'd')
    if (moment(evalDate).format('d') === '0' || moment(evalDate).format('d') === '6') {
      cost += 7
      console.log(`the weekend day is ${moment(evalDate).format('dddd')}`)
    } else {
      cost += 5
      console.log(`the weekday is ${moment(evalDate).format('dddd')}`)
    }
  }
  return cost
}