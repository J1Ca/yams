import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './yams.css';
import { Col } from 'reactstrap';


function Dice(props) {   
  let diceStyle;
  let diceAnimation = 'text-center';
  if (!props.isSelected) {
    diceStyle = {
      border: '2px solid transparent',
      borderRadius: '5px',
      padding: '2px',
      minWidth: '45px',
      maxWidth: 'fit-content'
    };
    diceAnimation = 'text-center rollingDice'
  } else {
    diceStyle = {
      border: '2px solid #0069D9',
      borderRadius: '5px',
      padding: '2px',
      minWidth: '45px',
      maxWidth: 'fit-content'
    };
  }
  const routeImg = './0'+props.diceNumber+'.png';
  const rollDice = (diceId) => {
    props.rollDiceParent(diceId);    
  }   
  return (
    <Col className={diceAnimation} style={diceStyle} onClick={()=>rollDice(props.id)}>
        <img style={{width:'45px'}} src={routeImg} alt='dice'/>
    </Col>    
  );
}

export default Dice;
