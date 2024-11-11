const form = document.getElementById('tip-calculator__form');
const inputs = document.querySelectorAll('input');
const submitButton = document.getElementById('btn__submit');
const resetButton = document.getElementById('btn__reset');
// results
var tipAmount = document.getElementById('tip-amount');
var totalAmount = document.getElementById('total-amount');
// inputs
const inputBill = document.getElementById('bill');
const inputCustomTip = document.getElementById('tip-custom');
const inputNoOfPeople = document.getElementById('people');
const radioGroupTipAmount =
	document.getElementsByClassName('tip__radio-group')[0];
var lastSelectedTip;

const validations = {
	// validator options
	bill: (value) => value >= 1,
	'tip-custom': (value) =>
		radioGroupTipAmount.querySelector('input:checked') == null
			? value >= 1
			: value == '',
	people: (value) => value >= 1,
};

const renderError = (type) => {
	// assign an error message to the form by type
	switch (type) {
		case 'tip-custom':
			document.querySelector('.tip-calculator__tip .error').textContent =
				'Can not be 0!';
			document
				.querySelector(
					'.tip-calculator__tip .tip-calculator__input--number'
				)
				.classList.add('invalid');
			break;
		case 'bill':
			document.querySelector('.tip-calculator__bill .error').textContent =
				'Can not be 0!';
			document
				.querySelector('.tip-calculator__bill input')
				.classList.add('invalid');
			break;
		case 'people':
			document.querySelector(
				'.tip-calculator__people .error'
			).textContent = 'Can not be 0!';
			document
				.querySelector('.tip-calculator__people input')
				.classList.add('invalid');
			break;
	}
};

const clearError = (type) => {
	// clear an error message to the form by type
	switch (type) {
		case 'tip-custom':
			document.querySelector('.tip-calculator__tip .error').textContent =
				'';
			document
				.querySelector(
					'.tip-calculator__tip .tip-calculator__input--number'
				)
				.classList.remove('invalid');
			break;
		case 'bill':
			document.querySelector('.tip-calculator__bill .error').textContent =
				'';
			document
				.querySelector('.tip-calculator__bill input')
				.classList.remove('invalid');
			break;
		case 'people':
			document.querySelector(
				'.tip-calculator__people .error'
			).textContent = '';
			document
				.querySelector('.tip-calculator__people input')
				.classList.remove('invalid');
			break;
	}
};

const calculateTipAndPrice = () => {
	// calculate tip amount and total price per person
	var tipRate = radioGroupTipAmount.querySelector('input:checked')
		? radioGroupTipAmount.querySelector('input:checked').value
		: inputCustomTip.value;

	totalAmount.textContent =
		'$ ' + (inputBill.value / inputNoOfPeople.value).toFixed(2);

	tipAmount.textContent =
		'$ ' +
		((inputBill.value * (tipRate / 100)) / inputNoOfPeople.value).toFixed(
			2
		);
};

const dataIsValid = (key, value, validations) => {
	if (!validations[key]) return true; // if there's no validation, the field is always valid
	return validations[key](value);
};

const formIsValid = (form, validations) => {
	// check any form field against any set of validations
	let isValid = true;
	const data = Object.fromEntries(new FormData(form));
	Object.keys(data).forEach((name) => {
		// pass in the validations to `dataIsValid` as the third argument
		if (!dataIsValid(name, data[name], validations)) {
			isValid = false;
			renderError(name);
		} else {
			clearError(name);
		}
	});

	return isValid;
};
const handleSubmit = (e) => {
	// form submit event
	e.preventDefault();

	if (formIsValid(e.target, validations)) {
		calculateTipAndPrice();
	} else {
		renderError('Some data you have supplied is invalid!');
	}
};

const handleInputChange = (e) => {
	// triggering a submit event on the form when inputs are changed
	submitButton.click(e);
};

form.addEventListener('submit', handleSubmit);

inputCustomTip.addEventListener('focus', (e) => {
	// save the current selected tip and uncheck it
	lastSelectedTip = radioGroupTipAmount.querySelector('input:checked');
	radioGroupTipAmount.querySelector('input:checked').checked = false;
});

inputCustomTip.addEventListener('focusout', (e) => {
	// if no custom tip was specified mark the last selected tip (radio button) as checked
	if (inputCustomTip.value == '') {
		lastSelectedTip.checked = true;
	}
});
radioGroupTipAmount.querySelectorAll('label').forEach((label) => {
	// clear the custom tip value when clicking a radio button
	label.addEventListener('click', () => {
		inputCustomTip.value = '';
	});
});

inputs.forEach((input) => {
	input.addEventListener('change', handleInputChange);
});

resetButton.addEventListener('click', () => {
	// reset all inputs and results
	inputBill.value = '';
	inputNoOfPeople.value = '';
	inputCustomTip.value = '';
	totalAmount.textContent = '$ 0.00';
	tipAmount.textContent = '$ 0.00';
	radioGroupTipAmount.querySelector('input').checked = true;
});
