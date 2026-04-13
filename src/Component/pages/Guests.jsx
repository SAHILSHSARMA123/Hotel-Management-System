"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Star, Mail, Phone, Plus, Edit, Trash2, User, X, Save, Eye, Calendar, Home } from "lucide-react"
import "./Guests.css"

const Guests = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [guests, setGuests] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentGuest, setCurrentGuest] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "reserved",
    room: "",
    checkIn: "",
    checkOut: "",
    vip: false
  })

  // Load guests from localStorage on component mount
  useEffect(() => {
    const savedGuests = localStorage.getItem("hotelGuests")
    if (savedGuests) {
      try {
        const parsedGuests = JSON.parse(savedGuests)
        if (Array.isArray(parsedGuests)) {
          setGuests(parsedGuests)
        }
      } catch (error) {
        console.error("Error loading guests:", error)
        loadSampleData()
      }
    } else {
      loadSampleData()
    }
  }, [])

  // Save to localStorage whenever guests change
  useEffect(() => {
    if (guests.length > 0) {
      localStorage.setItem("hotelGuests", JSON.stringify(guests))
    }
  }, [guests])

  const loadSampleData = () => {
    const initialGuests = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 234 567 8900",
        status: "checked-in",
        room: "301",
        checkIn: "2024-01-15",
        checkOut: "2024-01-20",
        vip: true,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1 234 567 8901",
        status: "reserved",
        room: "205",
        checkIn: "2024-01-18",
        checkOut: "2024-01-22",
        vip: false,
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike.j@email.com",
        phone: "+1 234 567 8902",
        status: "checked-in",
        room: "412",
        checkIn: "2024-01-14",
        checkOut: "2024-01-19",
        vip: true,
      },
      {
        id: 4,
        name: "Sarah Williams",
        email: "sarah.w@email.com",
        phone: "+1 234 567 8903",
        status: "checked-out",
        room: "108",
        checkIn: "2024-01-10",
        checkOut: "2024-01-15",
        vip: false,
      },
    ]
    setGuests(initialGuests)
    localStorage.setItem("hotelGuests", JSON.stringify(initialGuests))
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Add new guest
  const handleAddGuest = (e) => {
    e.preventDefault()
    
    const newGuest = {
      id: Date.now(), // Unique ID
      ...formData
    }
    
    // Add to guests array
    const updatedGuests = [...guests, newGuest]
    setGuests(updatedGuests)
    
    // Save to localStorage
    localStorage.setItem("hotelGuests", JSON.stringify(updatedGuests))
    
    // Reset form and close modal
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "reserved",
      room: "",
      checkIn: "",
      checkOut: "",
      vip: false
    })
    setShowAddModal(false)
    
    // Show success message
    alert("Guest added successfully!")
  }

  // Edit guest
  const handleEditGuest = (e) => {
    e.preventDefault()
    
    if (!currentGuest) return
    
    const updatedGuests = guests.map(guest => 
      guest.id === currentGuest.id 
        ? { ...currentGuest }
        : guest
    )
    
    setGuests(updatedGuests)
    localStorage.setItem("hotelGuests", JSON.stringify(updatedGuests))
    setShowEditModal(false)
    setCurrentGuest(null)
    alert("Guest updated successfully!")
  }

  // Delete guest
  const handleDeleteGuest = (id) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      const updatedGuests = guests.filter(guest => guest.id !== id)
      setGuests(updatedGuests)
      localStorage.setItem("hotelGuests", JSON.stringify(updatedGuests))
      alert("Guest deleted successfully!")
    }
  }

  // Open edit modal with guest data
  const openEditModal = (guest) => {
    setCurrentGuest({...guest})
    setShowEditModal(true)
  }

  // Open view details modal
  const openViewDetails = (guest) => {
    setCurrentGuest(guest)
    setShowDetailModal(true)
  }

  // Handle contact button click
  const handleContact = (guest) => {
    alert(`Contacting ${guest.name}\nEmail: ${guest.email}\nPhone: ${guest.phone}`)
  }

  // Filter guests based on search and status
  const filteredGuests = guests.filter(guest => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.room.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === "all" || guest.status === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  // Reset form when opening add modal
  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "reserved",
      room: "",
      checkIn: "",
      checkOut: "",
      vip: false
    })
    setShowAddModal(true)
  }

  return (
    <div className="guests-page">
      <div className="guests-container">
        <div className="guests-header">
          <div>
            <h1 className="page-title">Guest Management</h1>
            <p className="page-subtitle">View and manage your hotel guests</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Add New Guest
          </button>
        </div>

        <div className="guests-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search guests by name, email or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters-container">
            <select 
              className="filter-select"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Guests</option>
              <option value="checked-in">Checked In</option>
              <option value="reserved">Reserved</option>
              <option value="checked-out">Checked Out</option>
            </select>
            <button className="btn btn-secondary">
              <Filter size={18} />
              More Filters
            </button>
          </div>
        </div>

        {filteredGuests.length === 0 ? (
          <div className="no-guests">
            <User size={48} />
            <h3>No guests found</h3>
            <p>Try adjusting your search or add a new guest</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={openAddModal}
            >
              <Plus size={18} />
              Add First Guest
            </button>
          </div>
        ) : (
          <div className="guests-grid">
            {filteredGuests.map((guest) => (
              <div key={guest.id} className="guest-card">
                <div className="guest-header">
                  <div className="guest-avatar">
                    {guest.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="guest-info">
                    <div className="guest-name-row">
                      <h3 className="guest-name">{guest.name}</h3>
                      {guest.vip && (
                        <span className="vip-badge">
                          <Star size={12} />
                          VIP
                        </span>
                      )}
                    </div>
                    <span className={`status-badge ${guest.status}`}>
                      {guest.status === "checked-in" && "Checked In"}
                      {guest.status === "reserved" && "Reserved"}
                      {guest.status === "checked-out" && "Checked Out"}
                    </span>
                  </div>
                  <div className="guest-actions-menu">
                    <button 
                      className="icon-btn" 
                      onClick={() => openEditModal(guest)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="icon-btn" 
                      onClick={() => handleDeleteGuest(guest.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="guest-details">
                  <div className="detail-row">
                    <Mail size={16} />
                    <span className="detail-text">{guest.email}</span>
                  </div>
                  <div className="detail-row">
                    <Phone size={16} />
                    <span className="detail-text">{guest.phone}</span>
                  </div>
                  <div className="detail-row">
                    <Home size={16} />
                    <span className="detail-text">Room #{guest.room}</span>
                  </div>
                  <div className="detail-row">
                    <Calendar size={16} />
                    <span className="detail-text">
                      {guest.checkIn} to {guest.checkOut}
                    </span>
                  </div>
                </div>
                <div className="guest-actions">
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => openViewDetails(guest)}
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleContact(guest)}
                  >
                    <Phone size={16} />
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Guest Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Add New Guest</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddGuest}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input 
                      type="text" 
                      name="room" 
                      value={formData.room}
                      onChange={handleInputChange}
                      required 
                      placeholder="Enter room number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select 
                      name="status" 
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="reserved">Reserved</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input 
                      type="date" 
                      name="checkIn" 
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input 
                      type="date" 
                      name="checkOut" 
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input 
                        type="checkbox" 
                        name="vip" 
                        checked={formData.vip}
                        onChange={handleInputChange}
                      />
                      <span>VIP Guest</span>
                    </label>
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    Save Guest
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Guest Modal */}
        {showEditModal && currentGuest && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Edit Guest</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleEditGuest}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={currentGuest.name}
                      onChange={(e) => setCurrentGuest({...currentGuest, name: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={currentGuest.email}
                      onChange={(e) => setCurrentGuest({...currentGuest, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={currentGuest.phone}
                      onChange={(e) => setCurrentGuest({...currentGuest, phone: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Number *</label>
                    <input 
                      type="text" 
                      name="room" 
                      value={currentGuest.room}
                      onChange={(e) => setCurrentGuest({...currentGuest, room: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select 
                      name="status" 
                      value={currentGuest.status}
                      onChange={(e) => setCurrentGuest({...currentGuest, status: e.target.value})}
                      required
                    >
                      <option value="reserved">Reserved</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Check-in Date *</label>
                    <input 
                      type="date" 
                      name="checkIn" 
                      value={currentGuest.checkIn}
                      onChange={(e) => setCurrentGuest({...currentGuest, checkIn: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Check-out Date *</label>
                    <input 
                      type="date" 
                      name="checkOut" 
                      value={currentGuest.checkOut}
                      onChange={(e) => setCurrentGuest({...currentGuest, checkOut: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input 
                        type="checkbox" 
                        name="vip" 
                        checked={currentGuest.vip}
                        onChange={(e) => setCurrentGuest({...currentGuest, vip: e.target.checked})}
                      />
                      <span>VIP Guest</span>
                    </label>
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={18} />
                    Update Guest
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailModal && currentGuest && (
          <div className="modal-overlay">
            <div className="modal detail-modal">
              <div className="modal-header">
                <h2>Guest Details</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowDetailModal(false)}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="guest-detail-content">
                <div className="guest-detail-header">
                  <div className="detail-avatar">
                    {currentGuest.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="detail-header-info">
                    <div className="detail-name-row">
                      <h3>{currentGuest.name}</h3>
                      {currentGuest.vip && (
                        <span className="vip-badge">
                          <Star size={12} />
                          VIP
                        </span>
                      )}
                    </div>
                    <span className={`status-badge large ${currentGuest.status}`}>
                      {currentGuest.status === "checked-in" && "Checked In"}
                      {currentGuest.status === "reserved" && "Reserved"}
                      {currentGuest.status === "checked-out" && "Checked Out"}
                    </span>
                  </div>
                </div>
                
                <div className="detail-sections">
                  <div className="detail-section">
                    <h4>Contact Information</h4>
                    <div className="detail-items">
                      <div className="detail-item">
                        <Mail size={18} />
                        <div>
                          <span className="item-label">Email</span>
                          <span className="item-value">{currentGuest.email}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Phone size={18} />
                        <div>
                          <span className="item-label">Phone</span>
                          <span className="item-value">{currentGuest.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Stay Information</h4>
                    <div className="detail-items">
                      <div className="detail-item">
                        <Home size={18} />
                        <div>
                          <span className="item-label">Room Number</span>
                          <span className="item-value">#{currentGuest.room}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Calendar size={18} />
                        <div>
                          <span className="item-label">Check-in Date</span>
                          <span className="item-value">{currentGuest.checkIn}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Calendar size={18} />
                        <div>
                          <span className="item-label">Check-out Date</span>
                          <span className="item-value">{currentGuest.checkOut}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Additional Information</h4>
                    <div className="detail-items">
                      <div className="detail-item">
                        <div>
                          <span className="item-label">Guest ID</span>
                          <span className="item-value">{currentGuest.id}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div>
                          <span className="item-label">VIP Status</span>
                          <span className="item-value">
                            {currentGuest.vip ? "VIP Guest" : "Regular Guest"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowDetailModal(false)
                      openEditModal(currentGuest)
                    }}
                  >
                    <Edit size={18} />
                    Edit Guest
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleContact(currentGuest)}
                  >
                    <Phone size={18} />
                    Contact Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Guests