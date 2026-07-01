import { motion } from "framer-motion";

const PageHeader = ({ title, subtitle, eyebrow, action }) => {
  return (
    <motion.div
      className="ui-page-header"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div>
        {eyebrow && <span className="ui-page-eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="ui-page-header-action">{action}</div>}
    </motion.div>
  );
};

export default PageHeader;
