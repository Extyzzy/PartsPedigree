import validatejs from 'validate.js'

export default function validate(formValues, constraints) {
    // The formValues and validated against the formFields
    // the variable result hold the error messages of the field
    const result = validatejs(formValues, constraints);
    // If there is an error message, return it!
    if (result) {
        Object.keys(result).forEach(key => {
            // Return only the field error message if there are multiple
            if (result[key] && result[key].length)
                result[key] = result[key][0];
        });
        return result;
    }
    return {};
}