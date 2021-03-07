import './App.css';

function StatusMessages({ statuses }) {
  return (
    <>
      {statuses.map((status, index) => (
        <div key={index} className={status.type}>
          {status.message}
        </div>
      ))}
    </>
  );
}

export default StatusMessages;
