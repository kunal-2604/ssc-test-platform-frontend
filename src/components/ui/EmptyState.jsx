import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

const EmptyState = ({
  icon,
  title = "No data found",
  message = "There is nothing to show right now.",
  action
}) => {
  return (
    <motion.div
      className="ui-empty-state"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ui-empty-icon">{icon || <FiInbox />}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div className="ui-empty-action">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;
