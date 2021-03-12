import './App.css';

function StatusMessage({ type, message }) {
  return <div className={type}>{message}</div>;
}

export default StatusMessage;
