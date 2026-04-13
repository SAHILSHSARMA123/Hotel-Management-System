"use client"

import { useState, useEffect } from "react"
import { Utensils, Coffee, Cake, Salad, CheckCircle, X, Clock, ChefHat, Truck, Package } from "lucide-react"
import "./Food.css"

const Food = () => {
  const [activeCategory, setActiveCategory] = useState("all")
  const [orders, setOrders] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [showOrderPanel, setShowOrderPanel] = useState(false)
  const [orderProgress, setOrderProgress] = useState({})

  const menuItems = [
    {
      id: 1,
      name: "Grilled Salmon",
      category: "main",
      price: 28,
      description: "Fresh Atlantic salmon with roasted vegetables",
      imageType: "hero",
      available: true,
      estimatedTime: 25,
    },
    {
      id: 2,
      name: "Caesar Salad",
      category: "appetizer",
      price: 12,
      description: "Classic Caesar with parmesan and croutons",
      imageType: "minimal",
      available: true,
      estimatedTime: 15,
    },
    {
      id: 3,
      name: "Espresso",
      category: "beverage",
      price: 4,
      description: "Rich Italian espresso",
      imageType: "circle",
      available: true,
      estimatedTime: 5,
    },
    {
      id: 4,
      name: "Chocolate Cake",
      category: "dessert",
      price: 9,
      description: "Decadent chocolate layer cake",
      imageType: "hero",
      available: true,
      estimatedTime: 10,
    },
    {
      id: 5,
      name: "Beef Tenderloin",
      category: "main",
      price: 42,
      description: "Prime beef with truffle mashed potatoes",
      imageType: "minimal",
      available: true,
      estimatedTime: 30,
    },
    {
      id: 6,
      name: "Red Wine",
      category: "beverage",
      price: 15,
      description: "Premium Cabernet Sauvignon",
      imageType: "circle",
      available: true,
      estimatedTime: 5,
    },
    {
      id: 7,
      name: "Bruschetta",
      category: "appetizer",
      price: 10,
      description: "Tomato, basil, and garlic on toasted bread",
      imageType: "circle",
      available: true,
      estimatedTime: 12,
    },
    {
      id: 8,
      name: "Tiramisu",
      category: "dessert",
      price: 11,
      description: "Classic Italian coffee-flavored dessert",
      imageType: "minimal",
      available: true,
      estimatedTime: 8,
    },
  ]

  const categories = [
    { id: "all", name: "All Items", icon: Utensils },
    { id: "appetizer", name: "Appetizers", icon: Salad },
    { id: "main", name: "Main Course", icon: Utensils },
    { id: "dessert", name: "Desserts", icon: Cake },
    { id: "beverage", name: "Beverages", icon: Coffee },
  ]

  const orderStages = [
    { id: "ordered", label: "Ordered", icon: Clock, description: "Order received" },
    { id: "preparing", label: "Preparing", icon: ChefHat, description: "In the kitchen" },
    { id: "ready", label: "Ready", icon: Package, description: "Ready for pickup" },
    { id: "served", label: "Served", icon: Truck, description: "On your table" },
  ]

  const handleOrderNow = (item) => {
    const orderId = Date.now()
    const newOrder = {
      orderId,
      item,
      quantity: 1,
      status: "ordered",
      timestamp: new Date(),
      estimatedCompletion: new Date(Date.now() + item.estimatedTime * 60000),
    }
    
    setOrders(prev => [...prev, newOrder])
    setCurrentOrder(newOrder)
    setShowConfirmation(true)

    // Start progress simulation
    startOrderProgress(orderId, item.estimatedTime)

    // Auto-hide confirmation after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false)
    }, 3000)
  }

  const startOrderProgress = (orderId, estimatedTime) => {
    setOrderProgress(prev => ({
      ...prev,
      [orderId]: {
        stage: 0,
        timer: estimatedTime * 60, 
      }
    }))

    
    const interval = setInterval(() => {
      setOrderProgress(prev => {
        const progress = prev[orderId]
        if (!progress) {
          clearInterval(interval)
          return prev
        }

        const newTimer = progress.timer - 1
        let newStage = progress.stage

        // Progress through stages based on time elapsed
        if (progress.timer <= 0) {
          newStage = 3
        } else if (progress.timer <= estimatedTime * 15) {
          newStage = 2
        } else if (progress.timer <= estimatedTime * 45) {
          newStage = 1
        }

        if (newTimer <= 0) {
          clearInterval(interval)
          // Update order status to "served" when complete
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.orderId === orderId ? { ...order, status: "served" } : order
            )
          )
        }

        return {
          ...prev,
          [orderId]: {
            stage: newStage,
            timer: newTimer,
          }
        }
      })
    }, 1000)
  }

  const getOrderStatusIcon = (status) => {
    switch(status) {
      case "ordered": return <Clock size={16} />
      case "preparing": return <ChefHat size={16} />
      case "ready": return <Package size={16} />
      case "served": return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const getProgressPercentage = (orderId) => {
    const progress = orderProgress[orderId]
    if (!progress) return 0
    
    const order = orders.find(o => o.orderId === orderId)
    if (!order) return 0
    
    const totalTime = order.item.estimatedTime * 60
    const elapsed = totalTime - progress.timer
    return Math.min(100, (elapsed / totalTime) * 100)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateTotal = () => {
    return orders.reduce((total, order) => total + (order.item.price * order.quantity), 0)
  }

  const getImageUrl = (item) => {
    const images = {
      "Grilled Salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop&q=60",
      "Caesar Salad": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=60",
      "Espresso": "https://images.unsplash.com/photo-1510707577719-ae7c9b788690?w=600&auto=format&fit=crop&q=60",
      "Chocolate Cake": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=60",
      "Beef Tenderloin": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop&q=60",
      "Red Wine": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=60",
      "Bruschetta": "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&auto=format&fit=crop&q=60",
      "Tiramisu": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format&fit=crop&q=60",
    }
    return images[item.name] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=60"
  }

  const filteredItems = activeCategory === "all" ? menuItems : menuItems.filter((item) => item.category === activeCategory)

  return (
    <div className="food-page">
      {/* Order Confirmation Toast */}
     {showConfirmation && currentOrder && (
  <div className="popup-overlay">
    <div className="order-confirmation-popup">
      <div className="popup-content">
        <div className="popup-header">
          <CheckCircle className="popup-icon" size={32} />
          <h3>Order Placed Successfully!</h3>
          <button 
            className="popup-close"   
            onClick={() => setShowConfirmation(false)}
            aria-label="Close popup"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="popup-body">
          <div className="order-summary">
            <p className="order-message">
          
          
            </p>
            
            {currentOrder.details && (
              <div className="order-details">
                <h4>Order Details:</h4>
                <ul>
                  {currentOrder.details.quantity && (
                    <li>Quantity: {currentOrder.details.quantity}</li>
                  )}
                  {currentOrder.details.size && (
                    <li>Size: {currentOrder.details.size}</li>
                  )}
                  {currentOrder.details.customizations && (
                    <li>Customizations: {currentOrder.details.customizations}</li>
                  )}
                </ul>
              </div>
            )}
            
            <div className="estimated-time">
              <p>Estimated preparation time: <strong>10-15 minutes</strong></p>
            </div>
          </div>
        </div>
        
        <div className="popup-footer">
          <button 
            className="popup-action-button"
            onClick={() => setShowConfirmation(false)}
          >
            Got it
          </button>
          <button 
            className="popup-action-button secondary"
            onClick={() => {
           
              console.log("View order details");
            }}
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="food-container">
        <div className="food-header">
          <div className="header-top">
            <div>
              <h1 className="page-title">Restaurant & Dining</h1>
              <p className="page-subtitle">Explore our exquisite culinary offerings</p>
            </div>
            <button 
              className="btn btn-primary view-orders-btn"
              onClick={() => setShowOrderPanel(true)}
            > 
              View Orders ({orders.length})
            </button>
          </div>
          
          {orders.length > 0 && (
            <div className="order-summary-header">
              <div className="order-stats">
                <span className="order-count">
                  {orders.length} {orders.length === 1 ? "item" : "items"} ordered
                </span>
                <span className="order-total">
                  Total: ${calculateTotal().toFixed(2)}
                </span>
              </div>
              {orders.some(order => order.status !== "served") && (
                <div className="active-orders-count">
                  <Clock size={14} />
                  <span>
                    {orders.filter(order => order.status !== "served").length} active order(s)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                className={`category-tab ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <Icon size={18} />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>

        

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.map((item) => {
            const itemOrders = orders.filter(order => order.item.id === item.id && order.status !== "served")
            const isOrdered = itemOrders.length > 0
            
            return (
              <div key={item.id} className={`menu-card ${item.imageType}`}>
                <div className="menu-image">
                  <div className={`image-container ${item.imageType}`}>
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className={`food-image ${item.imageType}`}
                      loading="lazy"
                    />
                    <span className="category-badge">{item.category}</span>

                    {isOrdered && (
                      <div className="ordered-badge">
                        <Clock size={16}/>
                        <span>{itemOrders.length} in progress</span>
                      </div> 
                    )}

                    {item.imageType === "hero" && <div className="image-overlay"></div>}
                    {item.imageType === "circle" && <div className="circle-decoration"></div>}
                  </div>
                </div>
                <div className="menu-content">
                  <div className="menu-header">
                    <h3 className="menu-name">{item.name}</h3>
                    <span className="menu-price">${item.price}</span>
                  </div>
                  <p className="menu-description">{item.description}</p>
                  <div className="menu-details">
                    <span className="time-estimate">
                      <Clock size={14} />
                      {item.estimatedTime} mins
                    </span>
                  </div>
                  <div className="menu-footer">
                    <button
                      className={`btn btn-primary btn-small ${isOrdered ? "ordered" : ""}`}
                      disabled={!item.available}
                      onClick={() => handleOrderNow(item)}
                    >
                      {!item.available ? "Unavailable" : isOrdered ? "Add Another" : "Order Now"}
                    </button>
                    <span className={`availability ${item.available ? "available" : "unavailable"}`}>
                      {item.available ? "Available" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Panel Modal */}
      {showOrderPanel && (
        <div className="order-panel-overlay">
          <div className="order-panel">
            <div className="order-panel-header">
              <h2>Your Orders</h2>
              <button className="close-panel" onClick={() => setShowOrderPanel(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="order-panel-content">
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <Utensils size={48} />
                  <h3>No Orders Yet</h3>
                  <p>Order items from the menu to see them here</p>
                </div>
              ) : (
                <>
                  <div className="orders-list">
                    {orders.map((order) => {
                      const progress = orderProgress[order.orderId]
                      const progressPercent = getProgressPercentage(order.orderId)
                      
                      return (
                        <div key={order.orderId} className="order-item">
                          <div className="order-item-header">
                            <img 
                              src={getImageUrl(order.item)} 
                              alt={order.item.name}
                              className="order-item-image"
                            />
                            <div className="order-item-info">
                              <h4>{order.item.name}</h4>
                              <p>${order.item.price} × {order.quantity}</p>
                              <div className="order-status">
                                {getOrderStatusIcon(order.status)}
                                <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="order-progress">
                            <div className="progress-stages">
                              {orderStages.map((stage, index) => (
                                <div 
                                  key={stage.id}
                                  className={`progress-stage ${index <= (progress?.stage || 0) ? 'active' : ''} ${order.status === "served" ? 'completed' : ''}`}
                                >
                                  <div className="stage-icon">
                                    <stage.icon size={16} />
                                  </div>
                                  <div className="stage-label">{stage.label}</div>
                                </div>
                              ))}
                            </div>
                            
                            {order.status !== "served" && progress && (
                              <>
                                <div className="progress-bar">
                                  <div 
                                    className="progress-fill"
                                    style={{ width: `${progressPercent}%` }}
                                  ></div>
                                </div>
                                <div className="time-remaining">
                                  <Clock size={14} />
                                  <span>Time remaining: {formatTime(progress.timer)}</span>
                                </div>
                              </>
                            )}
                            
                            {order.status === "served" && (
                              <div className="order-completed">
                                <CheckCircle size={20} />
                                <span>Order completed at {order.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="order-summary-panel">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (10%)</span>
                      <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Food;