import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import logo from "assets/logo.svg";

const Logo: React.FC = () => {
  return (
    <StyledLogo to="/">
      <StyledImg src={logo} />
      <StyledText>Aelin</StyledText>
    </StyledLogo>
  );
};

const StyledLogo = styled(Link)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 44px;
  min-width: 44px;
  padding: 0;
  text-decoration: none;
`;

const StyledImg = styled.img`
  width: 40px;
  height: auto;
  margin-right: 8px;
`;

const StyledText = styled.span`
  color: ${(props) => props.theme.textColor};
  font-size: 18px;
  font-weight: 700;
  margin-left: ${(props) => props.theme.spacing[2]}px;
  @media (max-width: 400px) {
    display: none;
  }
`;

export default Logo;
