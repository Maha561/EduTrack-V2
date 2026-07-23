import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";


function App(){

return(

<Routes>

<Route path="/" element={<Home/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/register" element={<Register/>}/>


<Route 
path="/admin-dashboard"
element={<AdminDashboard/>}
/>


<Route
path="/student-dashboard"
element={<StudentDashboard/>}
/>

{/* Fallback route to handle routing exceptions for unmapped URLs */}
<Route path="*" element={<Navigate to="/" replace />} />

</Routes>

)

}

export default App;