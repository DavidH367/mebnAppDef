import React from 'react';
import TitleS from '../../styles/TitleS.module.css';

const Title = ({ children }) => {
  return <h2 style={{marginTop:'10px'}} className={TitleS.title}>{children}</h2>;
};

export default Title;
