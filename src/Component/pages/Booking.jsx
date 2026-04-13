import { useState, useEffect } from "react"
import { Check, CreditCard, Calendar, Users, Home } from "lucide-react"
import "./Booking.css"

const Booking = () => {
  const [step, setStep] = useState(1)
  const [bookingId, setBookingId] = useState("")
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    room: "",
    roomType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    totalPrice: 0,
    bookingDate: new Date().toISOString().split('T')[0],
    status: "reserved"
  })

  // Room prices mapping
  const roomPrices = {
    "standard": 149,
    "premium": 199,
    "deluxe": 299,
    "executive": 399
  }

  // Room display names
  const roomNames = {
    "standard": "Standard Room",
    "premium": "Premium Room",
    "deluxe": "Deluxe Suite",
    "executive": "Executive Suite"
  }

  // Calculate nights and total price
  const calculateTotal = () => {
    if (!formData.checkIn || !formData.checkOut || !formData.room) return 0
    
    const checkInDate = new Date(formData.checkIn)
    const checkOutDate = new Date(formData.checkOut)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) return roomPrices[formData.room] || 0
    
    return (roomPrices[formData.room] || 0) * nights
  }

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.room) {
      const total = calculateTotal()
      setFormData(prev => ({
        ...prev,
        totalPrice: total
      }))
    }
  }, [formData.checkIn, formData.checkOut, formData.room])

  useEffect(() => {
    // Generate booking ID
    setBookingId(`BK${Date.now().toString().slice(-8)}`)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // If room type changes, update room display name too
    if (name === "room") {
      setFormData({
        ...formData,
        [name]: value,
        roomType: roomNames[value] || ""
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleNext = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.checkIn || !formData.checkOut || !formData.room) {
        alert("Please fill all required fields")
        return
      }
      
      // Validate dates
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (checkInDate < today) {
        alert("Check-in date cannot be in the past")
        return
      }
      
      if (checkOutDate <= checkInDate) {
        alert("Check-out date must be after check-in date")
        return
      }
    }
    
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("Please fill all guest information fields")
        return
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address")
        return
      }
      
      // Basic phone validation
      const phoneRegex = /^[+]?[\d\s-]+$/
      if (!phoneRegex.test(formData.phone)) {
        alert("Please enter a valid phone number")
        return
      }
    }
    
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Final validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert("Please complete all required information")
      return
    }
    
    // Generate guest ID
    const guestId = Date.now()
    
    // Create guest object for Guest Management
    const newGuest = {
      id: guestId,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      status: "reserved", // New booking is reserved status
      room: "To be assigned", // Will be assigned later
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      vip: false,
      bookingId: bookingId,
      bookingDate: formData.bookingDate,
      guests: parseInt(formData.guests),
      roomType: formData.roomType,
      totalPrice: formData.totalPrice,
      paymentStatus: "pending"
    }
    
    // Save to localStorage
    const existingGuests = JSON.parse(localStorage.getItem("hotelGuests") || "[]")
    const updatedGuests = [...existingGuests, newGuest]
    localStorage.setItem("hotelGuests", JSON.stringify(updatedGuests))
    
    // Also save booking separately
    const existingBookings = JSON.parse(localStorage.getItem("hotelBookings") || "[]")
    const newBooking = {
      ...newGuest,
      bookingStatus: "confirmed"
    }
    const updatedBookings = [...existingBookings, newBooking]
    localStorage.setItem("hotelBookings", JSON.stringify(updatedBookings))
    
    // Show success message with booking ID
    alert(`Booking confirmed successfully!\nBooking ID: ${bookingId}\nGuest has been added to the Guest Management system.`)
    
    // Reset form for new booking
    setFormData({
      checkIn: "",
      checkOut: "",
      guests: "1",
      room: "",
      roomType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      totalPrice: 0,
      bookingDate: new Date().toISOString().split('T')[0],
      status: "reserved"
    })
    
    // Generate new booking ID
    setBookingId(`BK${Date.now().toString().slice(-8)}`)
    
    // Reset to step 1
    setStep(1)
  }

  // Calculate nights
  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0
    const checkInDate = new Date(formData.checkIn)
    const checkOutDate = new Date(formData.checkOut)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 0
  }

  const nights = calculateNights()

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="page-title">Book Your Stay</h1>
          <p className="page-subtitle">Complete the booking process in 3 simple steps</p>
          {bookingId && (
            <div className="booking-id-display">
              <span className="booking-id-label">Booking ID:</span>
              <span className="booking-id-value">{bookingId}</span>
            </div>
          )}
        </div>

        <div className="booking-progress">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <span className="step-label">Dates & Room</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <span className="step-label">Guest Info</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <span className="step-label">Confirmation</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form">
          {step === 1 && (
            <div className="form-step">
              <h2 className="step-title">Select Dates and Room</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={16} />
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Users size={16} />
                    Number of Guests
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Home size={16} />
                    Room Type
                  </label>
                  <select
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select a room</option>
                    <option value="standard">Standard Room - $149/night</option>
                    <option value="premium">Premium Room - $199/night</option>
                    <option value="deluxe">Deluxe Suite - $299/night</option>
                    <option value="executive">Executive Suite - $399/night</option>
                  </select>
                </div>
              </div>
              
              {formData.checkIn && formData.checkOut && formData.room && (
                <div className="price-preview">
                  <h4>Price Calculation</h4>
                  <div className="price-details">
                    <div className="price-item">
                      <span>Room rate:</span>
                      <span>${roomPrices[formData.room] || 0} per night</span>
                    </div>
                    <div className="price-item">
                      <span>Number of nights:</span>
                      <span>{nights}</span>
                    </div>
                    <div className="price-item total">
                      <span>Estimated total:</span>
                      <span>${formData.totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2 className="step-title">Guest Information</h2>
              <p className="step-description">Please provide the primary guest details</p>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div className="booking-summary-card">
                <h4>Booking Summary</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span>Room:</span>
                    <span>{formData.roomType || "Not selected"}</span>
                  </div>
                  <div className="summary-item">
                    <span>Check-in:</span>
                    <span>{formData.checkIn || "Not selected"}</span>
                  </div>
                  <div className="summary-item">
                    <span>Check-out:</span>
                    <span>{formData.checkOut || "Not selected"}</span>
                  </div>
                  <div className="summary-item">
                    <span>Nights:</span>
                    <span>{nights}</span>
                  </div>
                  <div className="summary-item">
                    <span>Guests:</span>
                    <span>{formData.guests}</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total:</span>
                    <span>${formData.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2 className="step-title">Confirm Your Booking</h2>
              <div className="confirmation-section">
                <div className="confirmation-header">
                  <Check size={32} className="success-icon" />
                  <h3>Ready to Complete Your Booking</h3>
                  <p className="confirmation-subtitle">
                    Review your details below and confirm to complete your reservation
                  </p>
                </div>
                
                <div className="final-summary">
                  <div className="summary-section">
                    <h4>Booking Details</h4>
                    <div className="summary-content">
                      <div className="summary-row">
                        <span className="label">Booking ID:</span>
                        <span className="value">{bookingId}</span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Room Type:</span>
                        <span className="value">{formData.roomType}</span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Stay Duration:</span>
                        <span className="value">
                          {formData.checkIn} to {formData.checkOut} ({nights} nights)
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Number of Guests:</span>
                        <span className="value">{formData.guests}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="summary-section">
                    <h4>Guest Information</h4>
                    <div className="summary-content">
                      <div className="summary-row">
                        <span className="label">Name:</span>
                        <span className="value">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Email:</span>
                        <span className="value">{formData.email}</span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Phone:</span>
                        <span className="value">{formData.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="summary-section total-section">
                    <h4>Payment Summary</h4>
                    <div className="summary-content">
                      <div className="summary-row">
                        <span className="label">Room Rate:</span>
                        <span className="value">${roomPrices[formData.room] || 0} × {nights} nights</span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Subtotal:</span>
                        <span className="value">${formData.totalPrice}</span>
                      </div>
                      <div className="summary-row">
                        <span className="label">Taxes & Fees:</span>
                        <span className="value">$0 (included)</span>
                      </div>
                      <div className="summary-row total-row">
                        <span className="label">Total Amount:</span>
                        <span className="value">${formData.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="payment-security">
                  <div className="security-info">
                    <Check size={18} />
                    <span>Your booking is secure and protected</span>
                  </div>
                  <div className="security-info">
                    <CreditCard size={18} />
                    <span>No payment required now - Pay at hotel</span>
                  </div>
                </div>
                
                <div className="terms-agreement">
                  <label className="checkbox-label">
                    <input type="checkbox" required />
                    <span>
                      I agree to the terms and conditions and understand that this is a reservation request.
                      The hotel will confirm availability and contact me for payment details.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" onClick={handlePrevious} className="btn btn-secondary">
                Previous
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary">
                {step === 2 ? 'Review Booking' : 'Next Step'}
              </button>
            ) : (
              <button type="submit" className="btn btn-primary btn-confirm">
                Confirm Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Booking