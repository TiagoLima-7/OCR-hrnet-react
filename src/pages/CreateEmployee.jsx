import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { addEmployee } from "../store/employeesSlice";
import { DEPARTMENTS, STATES } from "../features/employees/constants";
import Modal from "../components/common/Modal";

const EMPTY = {
  firstName: "",
  lastName: "",
  dateOfBirth: null,
  startDate: null,
  street: "",
  city: "",
  state: STATES[0],
  zipCode: "",
  department: DEPARTMENTS[0],
};

export default function CreateEmployee() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [showConfirm, setConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const setText = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };
  const setDate = (field, date) => setForm((p) => ({ ...p, [field]: date }));
  const setSelect = (field, opt) => setForm((p) => ({ ...p, [field]: opt }));

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate(),
      );
      if (form.dateOfBirth > minAge) {
        newErrors.dateOfBirth = "Employee must be at least 18 years old";
      }
      if (!form.startDate) newErrors.startDate = "Start date is required";
      console.log(minAge);
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(
      addEmployee({
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth?.toLocaleDateString("en-US"),
        startDate: form.startDate?.toLocaleDateString("en-US"),
        street: form.street,
        city: form.city,
        state: form.state?.value,
        zipCode: form.zipCode,
        department: form.department?.value,
      }),
    );
    setConfirm(true);
  }

  function handleClose() {
    setConfirm(false);
    setForm(EMPTY);
    navigate("/employees");
  }

  return (
    <div>
      <div className="title">
        <h1>HRnet</h1>
      </div>
      <div className="container">
        <h2>Create Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-top">
            <fieldset className="employee_personal_data">
              <legend>Personal Data</legend>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={setText}
                required
              />

              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={setText}
                required
              />

              <label>Date of Birth</label>
              <DatePicker
                selected={form.dateOfBirth}
                onChange={(d) => setDate("dateOfBirth", d)}
                dateFormat={"MM/dd/yyyy"}
                placeholderText=""
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={60}
                startDate={
                  new Date(
                    new Date().getFullYear() - 18,
                    new Date().getMonth(),
                    new Date().getDate(),
                  )
                }
              />
              {errors.dateOfBirth && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.dateOfBirth}
                </p>
              )}

              <label>Start Date</label>
              <DatePicker
                selected={form.startDate}
                onChange={(d) => setDate("startDate", d)}
                dateFormat={"MM/dd/yyyy"}
                placeholderText=""
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={60}
                minDate={form.dateOfBirth ?? undefined}
              />
              {errors.startDate && (
                <p style={{ color: "red", fontSize: "12px" }}>
                  {errors.startDate}
                </p>
              )}
            </fieldset>
            <fieldset className="address">
              <legend>Address</legend>

              <label htmlFor="street">Street</label>
              <input
                id="street"
                name="street"
                type="text"
                value={form.street}
                onChange={setText}
                required
              />

              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={setText}
                required
              />

              <label>State</label>
              <Select
                menuPortalTarget={document.body}
                classNamePrefix="rs"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#f6f6f6",
                  }),
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                options={STATES}
                value={form.state}
                onChange={(o) => setSelect("state", o)}
                placeholder="Select state..."
              />

              <label htmlFor="zipCode">Zip Code</label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={form.zipCode}
                onChange={setText}
                required
              />
            </fieldset>
          </div>

          <div className="form-bottom">
            <fieldset>
              <legend>Department</legend>
              <Select
                classNamePrefix="rs"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#f6f6f6",
                  }),
                }}
                options={DEPARTMENTS}
                value={form.department}
                onChange={(o) => setSelect("department", o)}
                placeholder="Select department"
              />
            </fieldset>
          </div>
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      </div>

      {showConfirm && (
        <Modal
          title="Employee Created"
          message={`${form.firstName} ${form.lastName} has been successfully added.`}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
