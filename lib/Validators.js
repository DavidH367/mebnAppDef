export const validateString = (input) => {
  const regex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/;
  return regex.test(input);
}
export const validateStringNoSpecialCharacters = (input) => {
  var pattern = /^[a-zA-Z0-9 ]*$/;
  return pattern.test(input);
};
export const ValidateEmail = (input)=>{
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
  return emailRegex.test(input);
}
export const validateCellphone = (inputStr)=> {
  const regex = /^\d{8}$/;
  return regex.test(inputStr);
  }
  
export const  validateID = (inputStr)=> {
  const regex = /^[\d-]{15,}$/;
  return regex.test(inputStr);
}


export const validatePassword = (inputStr)=>{
  let errors = [];

  if (inputStr.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }
  
  if (!/[A-Z]/.test(inputStr)) {
    errors.push("La contraseña debe contener al menos una letra mayúscula");
  }
  
  if (!/[a-z]/.test(inputStr)) {
    errors.push("La contraseña debe contener al menos una letra minúscula");
  }
  
  if (!/\d/.test(inputStr)) {
    errors.push("La contraseña debe contener al menos un número");
  }
  
  if (!/[^a-zA-Z0-9]/.test(inputStr)) {
    errors.push("La contraseña debe contener al menos un carácter especial");
  }
  

  return errors;
}
  
  