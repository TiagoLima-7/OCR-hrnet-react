import { createSlice } from "@reduxjs/toolkit";

const employeesSlice = createSlice({
  name: "employees",
  initialState: { list: [] },
  reducers: {
    addEmployee(state, action) {
      state.list.push(action.payload);
    },
  },
});

export const { addEmployee } = employeesSlice.actions;
export const selectEmployees = (state) => state.employees.list;
export default employeesSlice.reducer;
