import "./App.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/login" element={<div>Login</div>} />
      <Route path="/register" element={<div>Register</div>} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
      <Route path="/trips" element={<div>Trips</div>} />
      <Route path="/trips/:id" element={<div>Trip Details</div>} />
      <Route path="/create-trip" element={<div>Create Trip</div>} />
    </Routes>
  );
}

export default App;
