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
  type,
  value,
  setValue,
  isDisabled,
  errorMessage,
  isRequired,
  className: customClassName,
}) => {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        type={type}
        value={value}
        onValueChange={setValue}
        disabled={isDisabled}
        variant="bordered"
        className="form-inputs"
        size="lg"
        isRequired={isRequired !== null ? isRequired : false}
        validationState={errorMessage ? "invalid" : "valid"}
        errorMessage={errorMessage}
        label={label}
        startContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
        }
      />
    </div>
  );
};

import { useState } from "react";
export const PasswordInput = ({
  label,
  errorMessage,
  value,
  setValue,
  isDisabled,
  className: customClassName,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
      <Input
        aria-label="Text input"
        value={value}
        onValueChange={setValue}
        disabled={isDisabled}
        variant="bordered"
        className="form-inputs"
        size="lg"
        errorMessage={errorMessage}
        validationState={errorMessage ? "invalid" : "valid"}
        type={showPassword ? "text" : "password"}
        label={label}
        startContent={
          <UserIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
        }
      />
      <Checkbox
        aria-label="Text input"
        type="checkbox"
        size="xs"
        onClick={toggleShowPassword}
      >
        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      </Checkbox>
    </div>
  );
};