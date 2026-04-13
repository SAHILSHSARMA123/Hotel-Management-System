import { useState } from "react"
import { Users, Maximize, Wifi, Coffee, Tv, Wind, Calendar, UserPlus, Minus, Plus, X, CreditCard, CheckCircle, Shield, ArrowLeft, Loader } from "lucide-react"
import "./Rooms.css"

const Rooms = () => {
  const [filter, setFilter] = useState("all")
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingStep, setBookingStep] = useState(1) // 1: Dates & Guests, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    totalNights: 1,
    totalPrice: 0,
    paymentMethod: "credit",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    cardName: "",
    email: "",
    phone: "",
    specialRequests: "",
    agreeToTerms: false
  })

  const rooms = [
    {
      id: 1,
      name: "Deluxe Suite",
      type: "suite",
      price: 299,
      capacity: 4,
      size: 45,
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      available: true,
      amenities: ["WiFi", "Coffee Maker", "Smart TV", "Air Conditioning"],
    },
    {
      id: 2,
      name: "Executive Suite",
      type: "suite",
      price: 399,
      capacity: 4,
      size: 55,
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      available: true,
      amenities: ["WiFi", "Coffee Maker", "Smart TV", "Air Conditioning"],
    },
    {
      id: 3,
      name: "Premium Room",
      type: "premium",
      price: 199,
      capacity: 2,
      size: 35,
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      available: false,
      amenities: ["WiFi", "Coffee Maker", "Smart TV", "Air Conditioning"],
    },
    {
      id: 4,
      name: "Standard Room",
      type: "standard",
      price: 149,
      capacity: 2,
      size: 28,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      available: true,
      amenities: ["WiFi", "Smart TV", "Air Conditioning"],
    },
    {
      id: 5,
      name: "Presidential Suite",
      type: "suite",
      price: 599,
      capacity: 6,
      size: 85,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      available: true,
      amenities: ["WiFi", "Coffee Maker", "Smart TV", "Air Conditioning"],
    },
    {
      id: 6,
      name: "Family Room",
      type: "premium",
      price: 249,
      capacity: 5,
      size: 48,
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      available: true,
      amenities: ["WiFi", "Coffee Maker", "Smart TV", "Air Conditioning"],
    },
  ]

  const filteredRooms = filter === "all" ? rooms : rooms.filter((room) => room.type === filter)

  const handleBookNow = (room) => {
    setSelectedRoom(room)
    setBookingStep(1)
    
    // Calculate tomorrow's date for check-in
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextDay = new Date(tomorrow)
    nextDay.setDate(nextDay.getDate() + 1)
    
    setBookingDetails({
      ...bookingDetails,
      checkIn: tomorrow.toISOString().split('T')[0],
      checkOut: nextDay.toISOString().split('T')[0],
      adults: 1,
      children: 0,
      totalNights: 1,
      totalPrice: room.price
    })
  }

  const handleCloseBooking = () => {
    setSelectedRoom(null)
    setBookingStep(1)
    setIsProcessing(false)
    setTransactionId("")
    setBookingDetails({
      checkIn: "",
      checkOut: "",
      adults: 1,
      children: 0,
      totalNights: 1,
      totalPrice: 0,
      paymentMethod: "credit",
      cardNumber: "",
      cardExpiry: "",
      cardCVC: "",
      cardName: "",
      email: "",
      phone: "",
      specialRequests: "",
      agreeToTerms: false
    })
  }

  const updateBookingDetails = (field, value) => {
    let newDetails = { ...bookingDetails, [field]: value }
    
    // Calculate total nights if dates change
    if (field === 'checkIn' || field === 'checkOut') {
      const checkInDate = new Date(newDetails.checkIn)
      const checkOutDate = new Date(newDetails.checkOut)
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
      newDetails.totalNights = nights > 0 ? nights : 1
    }
    
    // Recalculate total price
    if (selectedRoom && (field === 'checkIn' || field === 'checkOut')) {
      newDetails.totalPrice = selectedRoom.price * newDetails.totalNights
    }
    
    setBookingDetails(newDetails)
  }

  const handleGuestChange = (type, operation) => {
    if (type === 'adults') {
      const newAdults = operation === 'increase' 
        ? bookingDetails.adults + 1
        : Math.max(1, bookingDetails.adults - 1)
      updateBookingDetails('adults', newAdults)
    } else {
      const newChildren = operation === 'increase'
        ? bookingDetails.children + 1
        : Math.max(0, bookingDetails.children - 1)
      updateBookingDetails('children', newChildren)
    }
  }

  const validateStep1 = () => {
    const today = new Date().toISOString().split('T')[0]
    
    if (!bookingDetails.checkIn) {
      alert("Please select check-in date")
      return false
    }
    
    if (!bookingDetails.checkOut) {
      alert("Please select check-out date")
      return false
    }
    
    if (bookingDetails.checkIn < today) {
      alert("Check-in date cannot be in the past")
      return false
    }
    
    if (bookingDetails.checkIn >= bookingDetails.checkOut) {
      alert("Check-out date must be after check-in date")
      return false
    }
    
    const totalGuests = bookingDetails.adults + bookingDetails.children
    if (totalGuests > selectedRoom.capacity) {
      alert(`This room can only accommodate ${selectedRoom.capacity} guests`)
      return false
    }
    
    if (totalGuests < 1) {
      alert("At least 1 guest is required")
      return false
    }
    
    return true
  }

  const validateStep2 = () => {
    if (!bookingDetails.email || !bookingDetails.email.includes('@')) {
      alert("Please enter a valid email address")
      return false
    }
    
    if (!bookingDetails.phone || bookingDetails.phone.length < 10) {
      alert("Please enter a valid phone number")
      return false
    }
    
    if (bookingDetails.paymentMethod === "credit") {
      if (!bookingDetails.cardNumber || bookingDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        alert("Please enter a valid 16-digit card number")
        return false
      }
      
      if (!bookingDetails.cardExpiry || !bookingDetails.cardExpiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        alert("Please enter a valid expiry date (MM/YY)")
        return false
      }
      
      if (!bookingDetails.cardCVC || bookingDetails.cardCVC.length !== 3) {
        alert("Please enter a valid 3-digit CVC")
        return false
      }
      
      if (!bookingDetails.cardName) {
        alert("Please enter the name on card")
        return false
      }
    }
    
    if (!bookingDetails.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return false
    }
    
    return true
  }

  const handleNextStep = () => {
    if (bookingStep === 1) {
      if (validateStep1()) {
        setBookingStep(2)
      }
    } else if (bookingStep === 2) {
      if (validateStep2()) {
        handleProcessPayment()
      }
    }
  }

  const handlePreviousStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1)
    }
  }

  const simulatePayment = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a 90% success rate
        if (Math.random() > 0.1) {
          resolve({
            success: true,
            transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
            message: "Payment successful!"
          })
        } else {
          reject({
            success: false,
            message: "Payment failed. Please try again or use a different payment method."
          })
        }
      }, 2000)
    })
  }

  const handleProcessPayment = async () => {
    setIsProcessing(true)
    
    try {
      const paymentResult = await simulatePayment()
      
      if (paymentResult.success) {
        setTransactionId(paymentResult.transactionId)
        
        // Save booking to localStorage (simulating backend storage)
        const bookingData = {
          roomId: selectedRoom.id,
          roomName: selectedRoom.name,
          ...bookingDetails,
          bookingDate: new Date().toISOString(),
          transactionId: paymentResult.transactionId,
          bookingId: `BK${Date.now()}`
        }
        
        // Save to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]')
        existingBookings.push(bookingData)
        localStorage.setItem('hotelBookings', JSON.stringify(existingBookings))
        
        setBookingStep(3)
      }
    } catch (error) {
      alert(error.message || "Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  // Calculate max date (6 months from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setMonth(maxDate.getMonth() + 6)
    return maxDate.toISOString().split('T')[0]
  }

  // Calculate min date for check-out (day after check-in)
  const getMinCheckOutDate = () => {
    if (!bookingDetails.checkIn) return ""
    const minDate = new Date(bookingDetails.checkIn)
    minDate.setDate(minDate.getDate() + 1)
    return minDate.toISOString().split('T')[0]
  }

  return (
    <div className="rooms-page">
      <div className="rooms-container">
        <div className="rooms-header">
          <h1 className="page-title">Our Rooms</h1>
          <p className="page-subtitle">Choose from our selection of luxurious accommodations</p>
        </div>

        <div className="filter-tabs">
          <button className={`filter-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All Rooms
          </button>
          <button className={`filter-tab ${filter === "suite" ? "active" : ""}`} onClick={() => setFilter("suite")}>
            Suites
          </button>
          <button className={`filter-tab ${filter === "premium" ? "active" : ""}`} onClick={() => setFilter("premium")}>
            Premium
          </button>
          <button
            className={`filter-tab ${filter === "standard" ? "active" : ""}`}
            onClick={() => setFilter("standard")}
          >
            Standard
          </button>
        </div>

        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-image">
                <img 
                  src={room.image} 
                  alt={room.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
                  }}
                />
                <div className={`availability-badge ${room.available ? "available" : "unavailable"}`}>
                  {room.available ? "Available" : "Booked"}
                </div>
              </div>
              <div className="room-content">
                <h3 className="room-name">{room.name}</h3>
                <div className="room-specs">
                  <div className="room-spec">
                    <Users size={16} />
                    <span>{room.capacity} Guests</span>
                  </div>
                  <div className="room-spec">
                    <Maximize size={16} />
                    <span>{room.size} m²</span>
                  </div>
                </div>
                <div className="room-amenities">
                  {room.amenities.slice(0, 4).map((amenity, index) => (
                    <div key={index} className="amenity">
                      {amenity === "WiFi" && <Wifi size={14} />}
                      {amenity === "Coffee Maker" && <Coffee size={14} />}
                      {amenity === "Smart TV" && <Tv size={14} />}
                      {amenity === "Air Conditioning" && <Wind size={14} />}
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                <div className="room-footer">
                  <div className="room-price">
                    <span className="price-amount">${room.price}</span>
                    <span className="price-period">/night</span>
                  </div>
                  <button 
                    className={`btn ${room.available ? "btn-primary" : "btn-disabled"}`} 
                    onClick={() => room.available && handleBookNow(room)}
                    disabled={!room.available}
                  >
                    {room.available ? "Book Now" : "Not Available"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <div className="booking-modal-header">
              <h2>
                {bookingStep === 1 && "Select Dates & Guests"}
                {bookingStep === 2 && "Complete Booking"}
                {bookingStep === 3 && "Booking Confirmed!"}
              </h2>
              <button className="close-btn" onClick={handleCloseBooking}>
                <X size={24} />
              </button>
            </div>

            {/* Booking Steps Indicator */}
            <div className="booking-steps">
              <div className={`step ${bookingStep >= 1 ? "active" : ""}`}>
                <div className="step-number">1</div>
                <span>Dates & Guests</span>
              </div>
              <div className={`step ${bookingStep >= 2 ? "active" : ""}`}>
                <div className="step-number">2</div>
                <span>Payment</span>
              </div>
              <div className={`step ${bookingStep >= 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <span>Confirmation</span>
              </div>
            </div>

            <div className="booking-modal-content">
              {/* Step 1: Dates & Guests */}
              {bookingStep === 1 && (
                <>
                  <div className="booking-room-info">
                    <img src={selectedRoom.image} alt={selectedRoom.name} />
                    <div className="room-info-details">
                      <h3>{selectedRoom.name}</h3>
                      <div className="room-info-specs">
                        <div className="room-info-spec">
                          <Users size={16} />
                          <span>Max {selectedRoom.capacity} guests</span>
                        </div>
                        <div className="room-info-spec">
                          <Maximize size={16} />
                          <span>{selectedRoom.size} m²</span>
                        </div>
                      </div>
                      <div className="room-price-info">
                        <span className="price-per-night">${selectedRoom.price} / night</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-details">
                    <h3>Select Dates & Guests</h3>
                    
                 <div className="booking-dates">
  <div className="date-input">
    <label htmlFor="checkIn">
      <Calendar size={16} />
      Check-in Date
    </label>
    <input
      type="date"
      id="checkIn"
      name="checkIn"
      value={bookingDetails.checkIn}
      min={new Date().toISOString().split('T')[0]}
      max={getMaxDate()}
      onChange={(e) => updateBookingDetails('checkIn', e.target.value)}
      required
      aria-label="Select check-in date"
      aria-describedby="checkIn-description"
    />
    <small id="checkIn-description" className="date-hint">
      Select your arrival date
    </small>
  </div>
  
  <div className="date-input">
    <label htmlFor="checkOut">
      <Calendar size={16} />
      Check-out Date
    </label>
    <input
      type="date"
      id="checkOut"
      name="checkOut"
      value={bookingDetails.checkOut}
      min={getMinCheckOutDate()}
      max={getMaxDate()}
      onChange={(e) => updateBookingDetails('checkOut', e.target.value)}
      required
      disabled={!bookingDetails.checkIn}
      aria-label="Select check-out date"
      aria-describedby="checkOut-description"
    />
    <small id="checkOut-description" className="date-hint">
      {bookingDetails.checkIn ? "Select departure date" : "Select check-in date first"}
    </small>
  </div>
</div>

                    <div className="guests-selection">
                      <h4>
                        <UserPlus size={16} />
                        Guests
                      </h4>
                      
                      <div className="guests-control">
                        <div className="guest-type">
                          <span>Adults</span>
                          <div className="guest-counter">
                            <button 
                              className="counter-btn"
                              onClick={() => handleGuestChange('adults', 'decrease')}
                              disabled={bookingDetails.adults <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="guest-count">{bookingDetails.adults}</span>
                            <button 
                              className="counter-btn"
                              onClick={() => handleGuestChange('adults', 'increase')}
                              disabled={bookingDetails.adults + bookingDetails.children >= selectedRoom.capacity}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="guest-type">
                          <span>Children</span>
                          <div className="guest-counter">
                            <button 
                              className="counter-btn"
                              onClick={() => handleGuestChange('children', 'decrease')}
                              disabled={bookingDetails.children <= 0}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="guest-count">{bookingDetails.children}</span>
                            <button 
                              className="counter-btn"
                              onClick={() => handleGuestChange('children', 'increase')}
                              disabled={bookingDetails.adults + bookingDetails.children >= selectedRoom.capacity}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <p className="capacity-info">
                        Maximum capacity: {selectedRoom.capacity} guests
                      </p>
                    </div>

                    <div className="booking-summary">
                      <h3>Price Summary</h3>
                      <div className="summary-details">
                        <div className="summary-item">
                          <span>${selectedRoom.price} × {bookingDetails.totalNights} nights</span>
                          <span>${selectedRoom.price * bookingDetails.totalNights}</span>
                        </div>
                        <div className="summary-total">
                          <span>Total Amount</span>
                          <span className="total-price">${bookingDetails.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button className="btn btn-primary btn-next" onClick={handleNextStep}>
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Payment Information */}
              {bookingStep === 2 && (
                <div className="payment-step">
                  <div className="payment-room-info">
                    <img src={selectedRoom.image} alt={selectedRoom.name} />
                    <div>
                      <h4>{selectedRoom.name}</h4>
                      <p>{bookingDetails.checkIn} to {bookingDetails.checkOut} • {bookingDetails.totalNights} nights</p>
                      <p className="payment-total">Total: ${bookingDetails.totalPrice}</p>
                    </div>
                  </div>

                  <div className="personal-info">
                    <h3>Personal Information</h3>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        value={bookingDetails.email}
                        onChange={(e) => updateBookingDetails('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        value={bookingDetails.phone}
                        onChange={(e) => updateBookingDetails('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Special Requests (Optional)</label>
                      <textarea
                        value={bookingDetails.specialRequests}
                        onChange={(e) => updateBookingDetails('specialRequests', e.target.value)}
                        placeholder="Any special requests or requirements..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="payment-method">
                    <h3>Payment Method</h3>
                    <div className="payment-options">
                      <button
                        className={`payment-option ${bookingDetails.paymentMethod === "credit" ? "active" : ""}`}
                        onClick={() => updateBookingDetails('paymentMethod', 'credit')}
                      >
                        <CreditCard size={20} />
                        <span>Credit/Debit Card</span>
                      </button>
                      <button
                        className={`payment-option ${bookingDetails.paymentMethod === "paypal" ? "active" : ""}`}
                        onClick={() => updateBookingDetails('paymentMethod', 'paypal')}
                      >
                        <Shield size={20} />
                        <span>PayPal</span>
                      </button>
                    </div>

                    {bookingDetails.paymentMethod === "credit" && (
                      <div className="card-details">
                        <div className="form-group">
                          <label>Name on Card *</label>
                          <input
                            type="text"
                            value={bookingDetails.cardName}
                            onChange={(e) => updateBookingDetails('cardName', e.target.value)}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Card Number *</label>
                          <input
                            type="text"
                            value={bookingDetails.cardNumber}
                            onChange={(e) => updateBookingDetails('cardNumber', formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Expiry Date *</label>
                            <input
                              type="text"
                              value={bookingDetails.cardExpiry}
                              onChange={(e) => updateBookingDetails('cardExpiry', formatExpiry(e.target.value))}
                              placeholder="MM/YY"
                              maxLength="5"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>CVC *</label>
                            <input
                              type="text"
                              value={bookingDetails.cardCVC}
                              onChange={(e) => updateBookingDetails('cardCVC', e.target.value.replace(/\D/g, ''))}
                              placeholder="123"
                              maxLength="3"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {bookingDetails.paymentMethod === "paypal" && (
                      <div className="paypal-info">
                        <p>You will be redirected to PayPal to complete your payment securely.</p>
                        <button className="btn btn-paypal">
                          Continue with PayPal
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="terms-section">
                    <div className="terms-checkbox">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={bookingDetails.agreeToTerms}
                        onChange={(e) => updateBookingDetails('agreeToTerms', e.target.checked)}
                      />
                      <label htmlFor="agreeToTerms">
                        I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Cancellation Policy</a>
                      </label>
                    </div>
                    <div className="security-note">
                      <Shield size={16} />
                      <span>Your payment is secured with SSL encryption</span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <button className="btn btn-secondary" onClick={handlePreviousStep}>
                      <ArrowLeft size={16} />
                      Back
                    </button>
                    <button 
                      className={`btn btn-primary ${isProcessing ? "processing" : ""}`} 
                      onClick={handleNextStep}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader size={16} className="spinner" />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay $${bookingDetails.totalPrice} Now`
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {bookingStep === 3 && (
                <div className="confirmation-step">
                  <div className="confirmation-icon">
                    <CheckCircle size={64} />
                  </div>
                  <h3>Booking Confirmed!</h3>
                  <p className="confirmation-message">
                    Thank you for your booking. Your reservation has been confirmed.
                  </p>
                  
                  <div className="confirmation-details">
                    <div className="detail-item">
                      <span>Booking ID:</span>
                      <strong>{transactionId}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Room:</span>
                      <span>{selectedRoom.name}</span>
                    </div>
                    <div className="detail-item">
                      <span>Check-in:</span>
                      <span>{bookingDetails.checkIn}</span>
                    </div>
                    <div className="detail-item">
                      <span>Check-out:</span>
                      <span>{bookingDetails.checkOut}</span>
                    </div>
                    <div className="detail-item">
                      <span>Total Nights:</span>
                      <span>{bookingDetails.totalNights}</span>
                    </div>
                    <div className="detail-item">
                      <span>Total Amount:</span>
                      <strong>${bookingDetails.totalPrice}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Payment Method:</span>
                      <span>{bookingDetails.paymentMethod === "credit" ? "Credit Card" : "PayPal"}</span>
                    </div>
                  </div>
                  
                  <div className="confirmation-note">
                    <p>A confirmation email has been sent to <strong>{bookingDetails.email}</strong></p>
                    <p>You can manage your booking online or contact us for any changes.</p>
                  </div>
                  
                  <div className="confirmation-actions">
                    <button className="btn btn-secondary" onClick={handlePrintReceipt}>
                      Print Receipt
                    </button>
                    <button className="btn btn-primary" onClick={handleCloseBooking}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Rooms;