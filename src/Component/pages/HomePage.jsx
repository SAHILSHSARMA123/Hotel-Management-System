import { Link } from "react-router-dom"
import { Sparkles, Shield, Clock, Award } from "lucide-react"
import "./HomePage.css"

const HomePage = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Luxury Comfort",
      description: "Experience unparalleled comfort in our meticulously designed rooms",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "24/7 security and safety measures for your peace of mind",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Round-the-clock service to cater to all your needs",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized globally for exceptional hospitality",
    },
  ]

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">LuxStay</span>
          </h1>
          <p className="hero-subtitle">
            Experience luxury redefined with world-class amenities and exceptional service
          </p>
          <div className="hero-buttons">
            <Link to="/booking" className="btn btn-primary">
              Book Now
            </Link>
            <Link to="/rooms" className="btn btn-secondary">
              Explore Rooms
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/reception.png" alt="Luxury Hotel"/>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose LuxStay</h2>
          <p className="section-subtitle">Discover the features that make us stand out</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <Icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Experience Luxury?</h2>
          <p className="cta-subtitle">Book your stay today and create unforgettable memories</p>
          <Link to="/booking" className="btn btn-primary btn-large">
            Reserve Your Room
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
