import { useState,useEffect } from "react";
import "./App.css";
import React from "react";

function Home() {
  return (
    <div>
      <nav>
        <h2>🎬 IMovies</h2>

        <div>
          <a href="/">Home</a>
          <a href="/movies">Movies</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Welcome to IMovies</h1>
        <p>Book your favorite movie tickets easily.</p>

        <a href="/movies">
          <button>Explore Movies</button>
        </a>
      </section>

      <section className="movies">
        <h2>Now Showing</h2>

        <div className="movie-container">
          <div className="movie-card">
            <div className="poster">🎬</div>
            <h3>Movie 1</h3>
            <p>Action • 2h 15m</p>
            <button>Book Now</button>
          </div>

          <div className="movie-card">
            <div className="poster">🍿</div>
            <h3>Movie 2</h3>
            <p>Comedy • 2h</p>
            <button>Book Now</button>
          </div>

          <div className="movie-card">
            <div className="poster">🎥</div>
            <h3>Movie 3</h3>
            <p>Drama • 2h 10m</p>
            <button>Book Now</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Movies load nahi hui");
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Movies load nahi hui. Backend check karo.");
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading movies...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Now Showing</h1>

      <div className="movie-container">
        {movies.length === 0 ? (
          <p>Abhi koi movie available nahi hai.</p>
        ) : (
          movies.map((movie) => (
            <div className="movie-card" key={movie._id}>
              {movie.poster ? (
                <img
                  className="poster"
                  src={movie.poster}
                  alt={movie.title}
                />
              ) : (
                <div className="poster">🎬</div>
              )}

              <h2>{movie.title}</h2>
              <p>{movie.genre} • {movie.duration}</p>
              <p>{movie.language}</p>
              <p>{movie.description}</p>
              <button
               onClick={() => {
    window.location.href = `/booking/${movie._id}`;
  }}
>
  Book Now
</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);
 
      alert(data.message);
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

function Booking() {
  const movieId = window.location.pathname.split("/").pop();

  const [seats, setSeats] = useState([]);

  const seatNumbers = [
    "A1", "A2", "A3", "A4",
    "B1", "B2", "B3", "B4",
    "C1", "C2", "C3", "C4"
  ];

  function selectSeat(seat) {
    setSeats((previous) =>
      previous.includes(seat)
        ? previous.filter((item) => item !== seat)
        : [...previous, seat]
    );
  }

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>Book Your Seats 🎟️</h1>
      <p>Movie ID: {movieId}</p>
      <h2>Select Your Seats</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 60px)",
        gap: "12px",
        justifyContent: "center",
        margin: "25px"
      }}>
        {seatNumbers.map((seat) => (
          <button
            key={seat}
            onClick={() => selectSeat(seat)}
            style={{
              background: seats.includes(seat) ? "green" : "#ff3d5a"
            }}
          >
            {seat}
          </button>
        ))}
      </div>

      <p>Selected seats: {seats.join(", ") || "None"}</p>
      <h3>Total: ₹{seats.length * 150}</h3>

      
<button
  onClick={async () => {
    if (seats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          seats,
        }),
      });
      console.log("Booking response status:", response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setSeats([]);

     window.location.href = `/payment?amount=${seats.length * 150}`;
    } catch (error) {
      alert(error.message || "Server se connect nahi ho paya.");
    }
  }}
>
  Confirm Booking
</button>

    </div>
  );
}

function MyBookings() {
  const [bookings, setBookings] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Bookings load nahi hui");
        }
        return response.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: "30px", color: "#fff", background: "#111", minHeight: "100vh" }}>
      <h1>My Bookings 🎟️</h1>

      {error && <p>{error}</p>}

      {bookings.length === 0 && !error && (
        <p>Abhi koi booking nahi hai.</p>
      )}

      {bookings.map((booking) => (
        <div
          key={booking._id}
          style={{
            background: "#222",
            padding: "20px",
            margin: "15px 0",
            borderRadius: "10px",
          }}
        >
          <h2>{booking.movieId?.title || "Movie"}</h2>
          <p>Seats: {booking.seats.join(", ")}</p>
          <p>Total Amount: ₹{booking.totalAmount}</p>
          <p>
            Booking Date:{" "}
            {new Date(booking.createdAt).toLocaleDateString("en-IN")}
          </p>
          
<button
  onClick={async () => {
    const confirmCancel = window.confirm(
      "Kya tum ye booking cancel karna chahti ho?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${booking._id}`,
        { method: "DELETE" }
      );

      const result = await response.text();
console.log("Cancel response status:", response.status);
console.log("Cancel response body:", result);

if (!response.ok) {
  throw new Error(result);
}

alert("Server response: " + result);

      if (!response.ok) {
        throw new Error(data.message || "Cancellation failed");
      }

      setBookings((previous) =>
        previous.filter((item) => item._id !== booking._id)
      );

      alert("Booking cancelled successfully!");
    } catch (error) {
      alert(error.message);
    }
  }}
  style={{
    background: "#e53935",
    color: "white",
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  Cancel Booking
</button>
        </div>
      ))}
    </div>
  );
}

function DemoPayment() {
  const [paid, setPaid] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const params = new URLSearchParams(window.location.search);
  const amount = Number(params.get("amount")) || 0;

  function payNow() {
    setLoading(true);

    // Demo only: no real money is charged.
    setTimeout(() => {
      setPaid(true);
      setLoading(false);
    }, 1000);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      color: "white",
      padding: "30px",
      textAlign: "center"
    }}>
      <h1>IMovies Demo Payment</h1>

      {paid ? (
        <>
          <h2>✅ Demo Payment Successful!</h2>
          <p>This is a demo only. No money was charged.</p>
          <a href="/my-bookings" style={{ color: "#7ee787" }}>
            View My Bookings
          </a>
        </>
      ) : (
        <>
          <h2>Payment Summary</h2>
          <p>Amount: ₹{amount}</p>
          <p>Payment mode: Demo Payment</p>

          <button
            onClick={payNow}
            disabled={loading}
            style={{
              padding: "12px 24px",
              background: "#e50914",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          <p style={{ color: "#bbb", marginTop: "15px" }}>
            Demo only — no real payment will be processed.
          </p>
        </>
      )}
    </div>
  );
}

export { Home, Movies, Login, Register,Booking,MyBookings,DemoPayment };