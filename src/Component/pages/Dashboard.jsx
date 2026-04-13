import { TrendingUp, Users, DollarSign, Bed, ArrowUpRight, ArrowDownRight } from "lucide-react"
import "./Dashboard.css"

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹124,563",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Guests",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Occupancy Rate",
      value: "87%",
      change: "-2.4%",
      trend: "down",
      icon: Bed,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "+0.3",
      trend: "up",
      icon: TrendingUp,
    },
  ]

  const recentBookings = [
    { id: 1, guest: "John Doe", room: "Deluxe Suite", checkIn: "2024-01-15", status: "Confirmed" },
    { id: 2, guest: "Jane Smith", room: "Premium Room", checkIn: "2024-01-16", status: "Pending" },
    { id: 3, guest: "Mike Johnson", room: "Executive Suite", checkIn: "2024-01-17", status: "Confirmed" },
    { id: 4, guest: "Sarah Williams", room: "Standard Room", checkIn: "2024-01-18", status: "Confirmed" },
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Monitor your hotel's performance and metrics</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="stat-card">
                <div className="stat-header">
                  <span className="stat-title">{stat.title}</span>
                  <div className="stat-icon">
                    <Icon size={20} />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change {stat.trend}`}>
                  {stat.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span>{stat.change}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="dashboard-content">
          <div className="bookings-card">
            <h2 className="card-title">Recent Bookings</h2>
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room</th>
                    <th>Check-in</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.guest}</td>
                      <td>{booking.room}</td>
                      <td>{booking.checkIn}</td>
                      <td>
                        <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
