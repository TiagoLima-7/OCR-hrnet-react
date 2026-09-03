import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";

const CreateEmployee = lazy(() => import("./pages/CreateEmployee"));
const EmployeeList = lazy(() => import("./pages/EmployeeList"));

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="/" element={<Navigate to="/create" replace />} />
              <Route path="/create" element={<CreateEmployee />} />
              <Route path="/employees" element={<EmployeeList />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}
