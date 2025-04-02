import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./landhome.css"; // Import the CSS file

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <motion.h1 
        className="landing-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to the World's Worst "Customer Support" Chatbot!
      </motion.h1>

      <motion.p 
        className="landing-description"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Tired of getting helpful responses? Look no further! This chatbot guarantees to frustrate, confuse, and amuse you with the worst customer support ever. Ask anything, and get the most absurd responses possible.
      </motion.p>

      {/* Buttons Container */}
      <div className="button-container">

        <motion.button
          className="landing-button signup-button"
          onClick={() => navigate("/signup")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Signup
        </motion.button>

        <motion.button
          className="landing-button login-button"
          onClick={() => navigate("/login")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Login
        </motion.button>

        <motion.button
          className="landing-button users-button"
          onClick={() => navigate("/users")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Manage Users
        </motion.button>
      </div>
    </div>
  );
}
