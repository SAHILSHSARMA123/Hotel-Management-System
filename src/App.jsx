import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "../src/Component/Navigation"
import HomePage from "../src/Component/pages/HomePage"
import Dashboard from "../src/Component/pages/Dashboard"
import Rooms from "../src/Component/pages/Rooms"
import Booking from "../src/Component/pages/Booking"
import Guests from "../src/Component/pages/Guests"
import Food from "../src/Component/pages/Food"
import "./App.css"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/food" element={<Food />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
