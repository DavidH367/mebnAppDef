import { useEffect, useState } from "react";
import { Container, Text } from "@nextui-org/react";
const Alert = ({ title, message, message2, type }) => {
  const [showAlert, setShowAlert] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  });
  return (
    <>
      {showAlert && (
        <div className={`alert-container bg-${type}`}>
          <p>{title}</p>
          <span>
            {message}
            <br />
            {message2}
          </span>
        </div>
      )}
    </>
  );
};

export default Alert;
