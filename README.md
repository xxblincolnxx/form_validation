# Validating a Form

## Directions

Look at `form.html`. It contains a form for pre-paid parking. It uses [Shoelace](https://shoelace.style/), a simple CSS framework for styling.

You will write JavaScript to validate this form. When the "Make Reservation" button is clicked, you should check the values of each field and make sure they are valid. If not, you have to visually alert the user to that fact.

If you look at the [Shoelace docs for form validation](https://shoelace.style/docs/forms.html#validation), you will see that the div element with class "input-field" that surrounds each form label and input is the element to change. You will add the "input-valid" or "input-invalid" class to this div.

Do this project in steps. Each step adds another layer of difficulty. Make sure and commit your code after each step, if not more often. Do not worry if you cannot complete all the steps!

### Step 1

Each field is required. If there is no user input in that field, mark it as invalid.

### Step 2

Add a message to each invalid field, saying "<field> is required," where <field> is the label or other descriptive text for the field. You can add this message as a div inside the div with the class "input-field".

This message should go away if the field is later marked as valid. This message should not repeat multiple times if the "Make Reservation" button is clicked multiple times.

### Step 3

Add the following validations:

* Car year must be a number.
* Car year must be after 1900.
* Car year cannot be in the future.
* Date parking must be in the future.
* Number of days must be a number.
* Number of days must be between 1 and 30.
* CVV must be a three-digit number.

### Step 4

Add the ability to show the user the total cost of their parking when they click the "Make Reservation" button. The div with id "total" should be filled with text showing the cost. This text should be removed if the form becomes invalid.

The cost is $5 per weekday, and $7 per weekend day. `.map` and `.reduce` will be very helpful in calculating the total cost.

### Step 5

Validate the format of the credit card number. The following code will let you know if it is valid:

```js
function validateCardNumber(number) {
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number))
        return false;

    return luhnCheck(number);
}

function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 == 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) == 0;
}
```

This code only works with 16 digit card numbers. "4111111111111111" is a valid card number you can use for testing purposes.

### Step 6

Add the following validations:

* Expiration date must be a valid month and year.
* Expiration date must not be in the past.


### PERSONAL CHALLENGE

Determine best practice for data cleansing and form inputs without a form validator extension

