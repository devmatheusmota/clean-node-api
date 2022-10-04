const validator = require('validator');
const EmailValidator = require('./email-validator');
const makeSut = () => {
	return new EmailValidator();
};
import { describe, expect, it } from 'vitest';

describe('Email Validator', () => {
	it('Should return true if validator returns true', () => {
		const sut = makeSut();
		const isEmailValid = sut.isValid('valid_email@email.com');
		expect(isEmailValid).toBeTruthy();
	});

	it('Should return false if validator returns false', () => {
		const sut = makeSut();
		const isEmailValid = sut.isValid('invalid_email');
		expect(isEmailValid).toBeFalsy();
	});

	it('Should call validator with correct email', () => {
		const sut = makeSut();
		sut.isValid('any_email@email.com');
		expect(sut.email).toEqual('any_email@email.com');
	});
});
