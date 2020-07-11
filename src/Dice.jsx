import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './yams.css';
import { Col } from 'reactstrap';


function Dice(props) {  
  let diceStyle;
  let rollClasse='text-center';
  if (!props.isSelected) {
    diceStyle = {
      border: '2px solid transparent',
      borderRadius: '5px',
      padding: '2px',
      width: '45px',
      maxWidth: 'fit-content'
    };
    // rollClasse = 'text-center rollingDice'
  } else {
    diceStyle = {
      border: '2px solid #0069D9',
      borderRadius: '5px',
      padding: '2px',
      width: '45px',
      maxWidth: 'fit-content'
    };
    // rollClasse = 'text-center'
  }
  const routeImg = './0'+props.diceNumber+'.png';
  const rollDice = (diceId) => {
    props.rollDiceParent(diceId);    
  }   
  return (
    <Col className={rollClasse} style={diceStyle} onClick={()=>{rollDice(props.id)}} >
        <img style={{width:'45px'}} src={routeImg} alt='dice'/>
    </Col>    
  );
}

export default Dice;
