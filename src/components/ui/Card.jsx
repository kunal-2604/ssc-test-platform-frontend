import { motion } from "framer-motion";

const Card = ({ children, className = "", hover = false, delay = 0 }) => {
  return (
    <motion.div
      className={`ui-card ${hover ? "ui-card-hover" : ""} ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
