import { motion } from "framer-motion";

const StatCard = ({ title, value, subtitle, icon, variant = "primary", delay = 0 }) => {
  return (
    <motion.div
      className={`stat-card stat-card-${variant}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
    >
      <div className="stat-card-top">
        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      {subtitle && <span>{subtitle}</span>}
    </motion.div>
  );
};

export default StatCard;
