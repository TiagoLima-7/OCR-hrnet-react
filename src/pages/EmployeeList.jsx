import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectEmployees } from "../store/employeesSlice";
import { DataTable } from "hrnet-datatable";

const columns = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "dateOfBirth", label: "Date Of Birth" },
  { key: "startDate", label: "Start Date" },
  { key: "street", label: "Street" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zipCode", label: "Zip Code" },
  { key: "department", label: "Department" },
];

export default function EmployeeList() {
  const employees = useSelector(selectEmployees);

  return (
    <div className="container">
      <h2>Current employees</h2>
      <DataTable data={employees} columns={columns} />
      <Link className="btn" to="/create">
        Home
      </Link>
    </div>
  );
}
