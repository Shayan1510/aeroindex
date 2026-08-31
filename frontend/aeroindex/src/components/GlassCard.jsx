export default function GlassCard({ className = "", children, ...props }) {
  return (
    <div className={`glass rounded-xl2 ${className}`} {...props}>
      {children}
    </div>
  );
}
