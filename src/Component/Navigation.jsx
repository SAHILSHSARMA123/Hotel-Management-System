"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Hotel, LayoutDashboard, Bed, Calendar, Users, UtensilsCrossed, Menu, X } from "lucide-react"
import "./Navigation.css"

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: "Home", path: "/", icon: Hotel },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Rooms", path: "/rooms", icon: Bed },
    { name: "Booking", path: "/booking", icon: Calendar },
    { name: "Guests", path: "/guests", icon: Users },
    { name: "Food", path: "/food", icon: UtensilsCrossed },
  ]

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <Hotel className="logo-icon" />
          <span className="logo-text">LuxStay</span>
        </Link>

        <div className="nav-links desktop">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className={`nav-link ${isActive ? "active" : ""}`}>
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="nav-links mobile">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}

export default Navigation
