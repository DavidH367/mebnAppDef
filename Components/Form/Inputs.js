import { Checkbox, Input } from "@nextui-org/react";
import {MailIcon} from '../Icons/MailIcon';
import {UserIcon} from '../Icons/UserIcon';

export const TextInput = ({
  label,
  placeholder,
  type,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  return (
    <>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {label}
      </p>
      <Input
        isClearable={!isDisabled}
        variant="bordered"
        aria-label="Text input"
        type={type}
        placeholder={placeholder}
        initialValue={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={isDisabled}
        fullWidth
        size="lg"
      />
      <span className="form-errors"></span>
    </>
  );
};

export const AgeInput = ({
  label,
  placeholder,
  type,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  return (
    <>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {label}
      </p>
      <Input
        isClearable={!isDisabled}
        variant="bordered"
        aria-label="Text input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={isDisabled}
        fullWidth
        size="lg"
      />
      <span className="form-errors"></span>
    </>
  );
};

export const TelephoneInput = ({
  label,
  placeholder,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  const handleTelephoneChange = (e) => {
    const formattedPhoneNumber = e.target.value
      .replace(/[^0-9]/g, "") // caracteres
      .replace(/(\d{4})(\d{4})/, "$1-$2")
      .slice(0, 9);
    e.target.value = formattedPhoneNumber;
    setValue(formattedPhoneNumber);
  };

  return (
    <>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {label}
      </p>
      <Input
        isClearable
        variant="bordered"
        aria-label="Text input"
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={handleTelephoneChange}
        disabled={isDisabled}
        fullWidth
        size="lg"
      />
      <span className="form-errors"></span>
    </>
  );
};

export const IDNumberInput = ({
  label,
  placeholder,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  const handleIDNumberChange = (e) => {
    const formattedIdNumber = e.target.value
      .replace(/[^0-9]/g, "") 
      .replace(/(\d{4})(\d{4})(\d{5})/, "$1-$2-$3")
      .slice(0, 15);
    e.target.value = formattedIdNumber;
    setValue(formattedIdNumber);
  };

  return (
    <>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {label}
      </p>
      <Input
        isClearable
        variant="bordered"
        aria-label="Text input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleIDNumberChange}
        disabled={isDisabled}
        fullWidth
        size="lg"
      />
      <span className="form-errors"></span>
    </>
  );
};

export const SearchTextInput = ({
  placeholder,
  type,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  return (
    <Input
      isClearable
      variant="bordered"
      aria-label="Text input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      disabled={isDisabled}
      fullWidth
      size="xl"
    />
  );
};

export const EmailInput = ({
  label,
  placeholder,
  type,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  return (
    <>
      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        {label}
      </p>
      <Input
        variant="bordered"
        aria-label="Text input"
        type={type}
        placeholder={placeholder}
        initialValue={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={isDisabled}
        fullWidth
        size="md"
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
        }
      />
      <span className="form-errors"></span>
    </>
  );
};

import { useState } from "react";
export const PasswordInput = ({
  label,
  placeholder,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <p style={{ marginTop: "20px", fontWeight: "bold"  }}>
        {label}
      </p>
      <Input
        variant="bordered"
        aria-label="Text input"
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        fullWidth
        size="md"
        startContent={
          <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
        }
      />
      <Checkbox
        aria-label="Text input"
        type="checkbox"
        size="xs"
        style={{ marginTop: "10px" }}
        onClick={() => {
          setShowPassword(!showPassword);
        }}
      >
        Mostrar Contraseña
      </Checkbox>
    </>
  );
};