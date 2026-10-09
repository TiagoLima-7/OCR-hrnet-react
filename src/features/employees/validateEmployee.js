// src/features/employees/validateEmployee.js

export function validateEmployee(form) {
  const errors = {};

  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const today = new Date();
    const minDOB = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
    if (form.dateOfBirth > minDOB) {
      errors.dateOfBirth = "Employee must be at least 18 years old";
    }
  }

  if (!form.startDate) {
    errors.startDate = "Start date is required";
  } else if (form.dateOfBirth && !errors.dateOfBirth) {
    const minStart = new Date(
      form.dateOfBirth.getFullYear() + 18,
      form.dateOfBirth.getMonth(),
      form.dateOfBirth.getDate(),
    );
    if (form.startDate < minStart) {
      errors.startDate =
        "Employee must be at least 18 years old at the start date";
    }
  }

  return errors;
}
