const icons = { success: '✓', error: '✕', info: 'i' };

const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast toast-${t.type}`}>
        <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>{icons[t.type]}</span>
        {t.message}
      </div>
    ))}
  </div>
);

export default ToastContainer;
