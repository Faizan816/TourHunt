const LeaveDialog = ({ onCancel, onContinue, message }) => (
  <div className="dialog-overlay">
    <div className="dialog-container">
      <div className="close-icon-container">
        <img
          onClick={onCancel}
          className="close-icon"
          src="/images/close.png"
          style={{ height: 20, width: 20 }}
        />
      </div>
      <div className="dialog-wrapper">
        <div className="dialog-content-holder">
          <div className="dialog-content">{message}</div>
        </div>
        <div className="dialog-buttons">
          <button className="dialog-continue-button" onClick={onContinue}>
            Continue
          </button>
          <button className="dialog-cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default LeaveDialog;
