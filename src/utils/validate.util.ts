import { formatMoneyToFixed } from "./utility";
export const VALIDATE_NUMBER = {
	pattern: /^([0-9]*[.][0-9]*|0)$/,
	message: "This field must be a number",
}

export const VALIDATE_NATURAL_NUMBERS = {
	pattern: /^([\d]*)$/,
	message: "This field allows inputting natural numbers only",
}

export const VALIDATE_REQUIRE = {
	required: true,
	message: "This field cannot be empty.",
}

export const validateMaximumDecimals = async (value: any, decimals: number = 2) => {
	if (!!value) {
		if (value.toString().includes('.')) {
			const numString = value.toString().split('.')
			if (numString[1].length > decimals) {
				return Promise.reject(
					`This field allows value with maximum ${decimals} decimals.`
				);
			}
		}
	}
	return Promise.resolve();
}

export const validateMaximumLength = async (value: any, maxLength: number = 10, mess: string = '') => {
	if (value) {
		let numString;
		if(!isNaN(value)){ // is number
			numString = value.toString().includes('.') ? value.toString().split('.')[0]?.length : value.length
		} else {
			numString = value.toString().length;
		}

		if(Number(numString) > maxLength) {
			return Promise.reject(mess || `The maximum length is ${maxLength} characters.`);
		}
	}
}

export const validateNumberMinMax = async (value: any, min: number, max: number, mess: string = '', fieldName: string = 'This Field') => {
	if(value){
		if(value <= min || value > max){
			return Promise.reject(mess || `${fieldName} must be between ${min}% and ${max}%.`);
		}
	}
	return Promise.resolve();
}

export const validateNaturalNumber = async (value: any, mess: string = '') => {
	if(value){
		if(!/^([\d]*)$/.test(value)){
			return Promise.reject(mess || 'This field allows natural number value only.');
		}
	}
	return Promise.resolve();
}

export const validateEmpty = async (value: any, mess: string = '') => {
	if(!value){
		return Promise.reject(mess || 'This field cannot be empty.');
	}
	return Promise.resolve();
}

export const validateIsNumber = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(value))){
			return Promise.reject(mess || 'This field must be a number.');
		}
	}
	return Promise.resolve();
}

export const validateURL = async (value: any, mess: string = '') => {
	if(value){
		if(!(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(value))){
			return Promise.reject(mess || 'This field must be a valid URL.');
		}
	}
	return Promise.resolve();
}

export const validateWebsite = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm.test(value))){
			return Promise.reject(mess || 'This field must be a valid URL.');
		}
	}
	return Promise.resolve();
}


export const validatePhoneNumber = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value))){
			return Promise.reject(mess || 'The phone number is an invalid International Phone Number.');
		}
	}
	return Promise.resolve();
}

export const validateEmail = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value))){
			return Promise.reject(mess || 'Email is invalid format. Please check again.');
		}
	}
	return Promise.resolve();
}

export const validatePassword = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.<>\/=|+_\\()]).{8,}$/.test(value))){
			return Promise.reject(mess || 'Password must have at least 8 characters with 1 uppercase, 1 lowercase letter and 1 number.');
		}
	}
	return Promise.resolve();
}


export const validateZipCodeUS = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^[0-9]{5}(?:-[0-9]{4})?$/.test(value))){
			return Promise.reject(mess || 'Invalid U.S. Postal Code.');
		}
	}
	return Promise.resolve();
}

export const validateTelegram = async (value: any, mess: string = '') => {
	if(value){
		if(!(/(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9-]*)\/?$/.test(value))){
			return Promise.reject(mess || 'Invalid Telegram invite link.');
		}
	}
	return Promise.resolve();
}

export const validateSpecialCharacters = async (value: any, mess: string = '') => {
	if(value){
		if(!(/^[A-Za-z0-9]+$/.test(value))){
			return Promise.reject(mess || `This field doesn't allow input special characters and spaces.`);
		}
	}
	return Promise.resolve();
}

export const onChangePrice = (
	value: any,
	form: any,
	fieldName: string,
	maxValue = 100000000000000,
	decimal = 6
) => {
	if (value === '.') return form.setFieldsValue({ [fieldName]: null })
	let number = value
		.toString()
		.replace(/[^0-9.]/g, '')
		.replace(/(\..*?)\..*/g, '$1')
	if (Number(number) >= maxValue) {
		number = number.slice(0, -1)
	}
	if (number.includes('.')) {
		const numString = number.toString().split('.')
		if (numString[1].length > decimal) {
			return form.setFieldsValue({ [fieldName]: formatMoneyToFixed({
					val: number.substring(0, number.length - 1),
					decimalCount: 0,
					toFix: 0,
					inputField: true
				}) })
		}
	}
	if(/^\d*(\.\d+)?$/.test(number) && !!Number(number)){
		form.setFieldsValue({ [fieldName]: formatMoneyToFixed({
				val: number,
				decimalCount: 0,
				toFix: 0,
				inputField: true
			}) })
	} else {
		form.setFieldsValue({ [fieldName]: number })
	}
};
