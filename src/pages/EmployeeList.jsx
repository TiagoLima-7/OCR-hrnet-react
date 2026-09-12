import { Link } from "react-router-dom";
import { DataTable } from "hrnet-datatable";

export default function EmployeeList() {
  return (
    <div className="container">
      <h1>Current employees</h1>
      <DataTable />
      <Link to="/create">Home</Link>
    </div>
  );
}
