import { motion } from "framer-motion";

const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`page-transition ${className}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
