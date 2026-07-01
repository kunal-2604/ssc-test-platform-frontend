const Skeleton = ({ type = "card", count = 1 }) => {
  return (
    <div className={`skeleton-wrapper skeleton-${type}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-item" key={index}>
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
