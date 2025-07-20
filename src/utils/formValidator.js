export class FormValidator {
    constructor(validations) {
        this.validations = validations;
    }

    validate(formData) {
        const errors = {};

        this.validations.forEach(({ field, method, validWhen, message }) => {
            const fieldValue = formData[field];
            const isValid = method(fieldValue);

            if (isValid !== validWhen) {
                if(fieldValue !== ""){
                    errors[field] = message;
                }
            }
        });

        return errors;
    }
}
