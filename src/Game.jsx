import React, { useState, useEffect } from 'react';
import './yams.css';
import {
    Button, 
    Container, 
    Row, 
    Col,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import Dice from './Dice'
import NavBar from './navbar'

function Game() {    
    var caseStyle = {
        height:'35px', 
        display:'flex', 
        justifyContent:'space-between',
        alignItems:'center',  
        borderRadius:'5px',
        border:'1px solid rgba(100,149,237,.5)',
        paddingTop: '2px' 
    }
    var scoreStyle = {
        display: 'inline-block',
        marginLeft: '4px', 
        marginBottom:'0px',
        marginTop:'2px',
        padding:'2px', 
        border:'1px solid rgba(0,0,0,.2)', 
        borderRadius:'5px',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        backgroundColor: 'white'
    }
    var totalStyle = {
        height:'35px', 
        display:'flex', 
        justifyContent:'space-between',
        alignItems:'center',  
        borderRadius:'5px',
        border:'1px solid rgb(100,149,237)',
        paddingTop: '2px',
    }

    const [localData, setLocalData] = useState(JSON.parse(localStorage.getItem('localGame')));
    const [globalCounter, setGlobalCounter] = useState(JSON.parse(localStorage.getItem('globalCounter')))
    const [gameCounter, setGameCounter] = useState(3);
    const [firstTime, setFirstTime] = useState(true);
    const [activePlayer, setActivePlayer] = useState(null);
    const [allDices, setAllDices] = useState([])
    const [selectedCase, setSelectedCase] = useState(null)
    const [modal, setModal] = useState(false);
    const [modalText, setModalText] = useState(null)

    useEffect(() => {
      const checkingGameSnap = () => {
        let snapInfo = JSON.parse(localStorage.getItem('snapshotGame'))
        if(snapInfo){
          setAllDices(snapInfo.dices)
          setActivePlayer(snapInfo.active)
          setGameCounter(snapInfo.lifes)
          setFirstTime(false)
        } else if (globalCounter===1){
          setActivePlayer(localData[0].name)
        } else {
          whoIsActive()
        }
      }
      checkingGameSnap()
    }, [])



    const updateGrille = (newValue, caseToUpdate) => {
      let copyGrille = [...localData];
      for (let i=0;i<copyGrille.length;i++){
        if (copyGrille[i].name === activePlayer) {
          let updatedUserGrille = copyGrille[i].grille.map(e=>{
            if(e.name === caseToUpdate){
              e.value = newValue
              return e
            } else if(e.fill === true) {            
              return e
            } else {
              e.value = null
              return e
            }
          });
          copyGrille[i].grille = updatedUserGrille
        }
      }                               
      setLocalData(copyGrille)
    }

    const handleCaseClick = (userName, nameGrille, numberGrille) => {
      if(firstTime){setModalText('Roll the dices first :)'); return setModal(true)}
      //checking active user
      if (userName !== activePlayer) {        
        setModalText('opps that is not your case');
        return setModal(true)
      }
      //checking if case is already fill
      const playerInfo = localData.find(e => e.name === activePlayer)
      const selectCase = playerInfo.grille.find(e => e.name === nameGrille)
      if (selectCase.fill === true) {
        setModalText('Case already fill, select another case');
        return setModal(true)
      }

      //Game algo
      setSelectedCase(nameGrille)
      //handling numbers
      if(numberGrille){
        let newSum = 0;
        for (let i=0;i<allDices.length;i++){
          if (allDices[i].number === numberGrille){
            newSum += allDices[i].number
          };              
        };
        return updateGrille(newSum, nameGrille)
      }
      //handling Plus and Moins
      if(nameGrille === 'Plus' || nameGrille === 'Moins') {
        let dicesSum = 0;
        for (let i=0;i<allDices.length;i++){
            dicesSum += allDices[i].number;
        };
        return updateGrille(dicesSum, nameGrille)
      }
      //handling Suite
      if (nameGrille === 'Suite'){
        let copyAllDices = [...allDices]
        let orderedDices = copyAllDices.sort((a, b) => {return a.number - b.number;})     
        let suiteSum=0;        
        for (let i=1;i<orderedDices.length;i++){
          let difNumber = orderedDices[i].number - orderedDices[i-1].number
          if (difNumber === 1){
            suiteSum += 1
          }              
        }; 
        let suiteValue = suiteSum === 4 ? 40 : 0;
        return updateGrille(suiteValue, nameGrille)      
      }
      // handling Full
      if (nameGrille === 'Full'){
        let copyAllDices = [...allDices]
        let orderedDices = copyAllDices.sort((a, b) => {return a.number - b.number;})
        let firstValue = orderedDices.filter(e=>e.number === orderedDices[0].number);
        let secondValue = orderedDices.filter(e=>e.number === orderedDices[4].number);
        let fullValue = 0
        if (firstValue.length === 3 && secondValue.length === 2 || firstValue.length === 2 && secondValue.length === 3){
          fullValue = 25
        }
        return updateGrille(fullValue, nameGrille)
      }
      //handling Carré
      if (nameGrille === 'Carré'){
        let copyAllDices = [...allDices];
        let orderedDices = copyAllDices.sort((a, b) => {return a.number - b.number;});
        let firstValue = orderedDices.filter(e=>e.number === orderedDices[0].number);
        let secondValue = orderedDices.filter(e=>e.number === orderedDices[4].number);
        
        let carreSum = 0;
        if (firstValue.length >= 4 || secondValue.length >= 4){
          for (let i=0;i<allDices.length;i++){
            carreSum += allDices[i].number
          };
        }
        return updateGrille(carreSum, nameGrille)
      }
      //handling YAM
      if (nameGrille === 'YAM'){
        let firstValue = allDices.filter(e=>e.number === allDices[0].number);
        let yamValue = firstValue.length === 5 ? 50 : 0;
        return updateGrille(yamValue, nameGrille)
      }
    }

    //handling dices 
    const handleRollDiceParent = (diceId) => {
      var selectedDices = allDices.map((e)=> {
        if(e.id === diceId) {        
          return {id:e.id, number: e.number, select:!e.select}
        } else {
          return e
        }
      });      
      setAllDices(selectedDices);
    };
    const playGame = () => {
      if (firstTime) {
        let whiteDices = [
            {id: 0, number: null, select:false},
            {id: 1, number: null, select:false},
            {id: 2, number: null, select:false},
            {id: 3, number: null, select:false},
            {id: 4, number: null, select:false},
        ]
        for (let i=0;i<whiteDices.length;i++) {
          let diceNumber= (Math.floor(Math.random() * 6 + 1)); 
          whiteDices[i].number = diceNumber
        };      
        setAllDices(whiteDices);   
        setGameCounter(gameCounter-1)
        setFirstTime(false)
        //snapshot game
        let snapshot = {
          active: activePlayer,
          lifes: gameCounter-1,
          dices: whiteDices
        }
        localStorage.setItem('snapshotGame', JSON.stringify(snapshot));
      } else {
        let rollAgain = allDices.map((e)=> {
        if(!e.select) {
          let diceNumber= (Math.floor(Math.random() * 6 + 1))
          return {id:e.id, number: diceNumber, select:e.select}
        } else {
          return e;
        }
        });
        setLocalData(JSON.parse(localStorage.getItem('localGame')));
        setSelectedCase(null);
        setAllDices(rollAgain);
        setGameCounter(gameCounter-1);
        //snapshot game
        let snapshot2 = {
          active: activePlayer,
          lifes: gameCounter-1,
          dices: rollAgain
        }
        localStorage.setItem('snapshotGame', JSON.stringify(snapshot2));
      }       
    } 

    //active player algo
    const whoIsActive = () => {
      let values = []
      for(let i=0;i<localData.length;i++){
        values.push(localData[i].lastRoll)
      }
      let activeInfo = localData.find(e => e.lastRoll === Math.min(...values))
      setActivePlayer(activeInfo.name)
    }

    //jouer buttom
    const handleJouer = () => {
      if(!selectedCase){
        setModalText('select one case');
        return setModal(true)
      }
      //save new data
      let copyLocal = [...localData]
      for (let i=0;i<copyLocal.length;i++){
        if (copyLocal[i].name === activePlayer) {
          copyLocal[i].lastRoll = globalCounter;
          let updatedFillStatus = copyLocal[i].grille.map(e=>{
            if(e.name === selectedCase){
              e.fill = true
              return e
            } else {
              return e
            }
          });
          copyLocal[i].grille = updatedFillStatus
        }
      }
      localStorage.setItem('localGame', JSON.stringify(copyLocal));
      localStorage.setItem('globalCounter', globalCounter+1);
      localStorage.removeItem('snapshotGame');
      setGlobalCounter(globalCounter+1);
      setAllDices([]);
      setFirstTime(true);
      setGameCounter(3);
      setSelectedCase(null);
      whoIsActive();
    }
    
    if(globalCounter > (12*localData.length)){
      alert('se acabo!! y no ganaste')
    }

    //making dynamic grille
    let headerPlayers = localData.map((e,i)=>{
      if(activePlayer === e.name) {
        return (
        <span key={i} className='h-player shadow ml-2 pl-2 pr-2 rounded text-center'
        style={{fontWeight:'600', fontSize:'1rem', color:'#0069D9'}}
        >{(i+1)+' - '+e.name}</span>
        )
      } else {
        return (
        <span key={i} className='h-player ml-2 pl-2 pr-2 rounded text-center'
        >{(i+1)+' - '+e.name}</span>
        )        
      }      
    })

    let casePlayers = localData.map((e,i)=>{
        return (
            <span key={i} style={scoreStyle} className='shadow-sm mb-1 rounded text-center'
            >{i+1}</span>
        )
    })
    let caseAs = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'As', 1)}
          >{e.grille[0].value}</span>
        )
    })

    let caseDeux = localData.map((e,i)=>{
        return (
        <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Deux', 2)}
        >{e.grille[1].value}</span>
        )
    })

    let caseTrois = localData.map((e,i)=>{
        return (
            <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Trois', 3)}
            >{e.grille[2].value}</span>
        )
    })

    let caseQuatre = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Quatre', 4)}
          >{e.grille[3].value}</span>
        )
    })

    let caseCinq = localData.map((e,i)=>{
        return (
        <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Cinq', 5)}
        >{e.grille[4].value}</span>
        )
    })
    let caseSix = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Six', 6)}
          >{e.grille[5].value}</span>
        )
    })
    //setting Total
    let caseTotal = localData.map((e,i)=>{
        let sumTotal = 0;
        for (let i=0;i<6; i++) {
          if (e.grille[i].fill) {
            sumTotal += e.grille[i].value
          }
        }
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 rounded text-center'
          >{sumTotal === 0 ? null : sumTotal}</span>
        )
    })

    let caseBonus = localData.map((e,i)=>{
        let bonus = 0;      
        let sumTotal = 0;
        for (let i=0;i<6; i++) {
            if (e.grille[i].fill) {
                sumTotal += e.grille[i].value
            }
        }
        if (sumTotal >= 63) {
            bonus = 35
        }      
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
          >{bonus === 0 ? null : bonus}</span>
          )
    })

    let caseTotal1 = localData.map((e,i)=>{
        let bonus = 0;      
        let sumTotal = 0;
        for (let i=0;i<6; i++) {
          if (e.grille[i].fill) {
            sumTotal += e.grille[i].value
          }
        }
        if (sumTotal >= 63) {
          bonus = 35
        }      
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
          >{bonus+sumTotal === 0 ? null : bonus+sumTotal}</span>
        )
    })

  //second part grille
    let casePlus = localData.map((e,i)=>{
        return (
          <div key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Plus')}
          >{e.grille[6].value}</div>
        )
    })

    let caseMoins = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Moins')}
          >{e.grille[7].value}</span>
        )
    })

    let caseTotal2 = localData.map((e,i)=>{
        let sumTotal2 = 0;
        
        if (e.grille[6].fill) {
          sumTotal2 += e.grille[6].value
        }
  
        if (e.grille[7].fill) {
          sumTotal2 -= e.grille[7].value
        }      
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
          >{sumTotal2 === 0 ? null : sumTotal2}</span>
        )
    })

    let caseSuite = localData.map((e,i)=>{
        return (
        <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Suite')}
        >{e.grille[8].value}</span>
        )
    })
    let caseFull = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Full')}
          >{e.grille[9].value}</span>
        )
    })

    let caseCarre = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'Carré')}
          >{e.grille[10].value}</span>
        )
    })
    let caseYam = localData.map((e,i)=>{
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
            onClick={()=>handleCaseClick(e.name, 'YAM')}
          >{e.grille[11].value}</span>
        )
    })

    //seting Total3
    let caseTotal3 = localData.map((e,i)=>{      
        let sumTotal3 = 0;
        for (let i=8;i<12; i++) {
          if (e.grille[i].fill) {
            sumTotal3 += e.grille[i].value
          }
        }
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
          >{sumTotal3 === 0 ? null : sumTotal3}</span>
        )
    })

    let caseResult = localData.map((e,i)=>{
        let bonus = 0;      
        let sumTotal = 0;
        for (let i=0;i<6; i++) {
          if (e.grille[i].fill) {
            sumTotal += e.grille[i].value
          }
        }
        if (sumTotal >= 63) {
          bonus = 35
        } 
        
        let sumTotal2 = 0;
        if (e.grille[6].fill) {
          sumTotal2 += e.grille[6].value
        }
        if (e.grille[7].fill) {
          sumTotal2 -= e.grille[7].value
        } 
  
        let sumTotal3 = 0;
        for (let i=8;i<12; i++) {
          if (e.grille[i].fill) {
            sumTotal3 += e.grille[i].value
          }
        }
        return (
          <span key={i} style={scoreStyle} className='shadow-sm mb-1 bg-white rounded text-center'
          >{sumTotal+bonus+sumTotal2+sumTotal3 === 0 ? null : sumTotal+bonus+sumTotal2+sumTotal3}</span>
        )
    })
    
    let diceList = allDices.map((e) => {        
      return <Dice rollDiceParent={handleRollDiceParent} key={e.id} id={e.id} diceNumber={e.number} isSelected={e.select}/>
    })

  return (
    <Container >
      <NavBar/>
      <Modal isOpen={modal}>
        <ModalHeader>OOOPS !</ModalHeader>
        <ModalBody>
            {modalText}
        </ModalBody>
        <ModalFooter>
        <Button color="primary" onClick={()=>setModal(false)}>got it!</Button>
        </ModalFooter>
      </Modal>

      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} id='header' >
          {headerPlayers}          
        </Col>        
      </Row>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} id="main-grille">
            {/* left grille */}
            <Col sm="6" style={{padding:'0px', marginRight:'6px'}}>
                <Col className='inchange-case shadow p-2 mb-1 rounded'>
                    Player: 
                    <span className='text-rigth'>
                      {casePlayers}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    As : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseAs}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Deux : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseDeux}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Trois : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseTrois}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Quatre : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseQuatre}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Cinq : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseCinq}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Six : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseSix}
                    </span> 
                </Col>
                <Col className='inchange-case shadow-sm p-2 mb-1 rounded'>
                    Total : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseTotal}
                    </span> 
                </Col>
                <Col className='inchange-case shadow-sm p-2 mb-1 rounded'>
                    Bonus : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseBonus}
                    </span> 
                </Col>
                <Col className='inchange-case shadow-sm p-2 mb-1 rounded'>
                    Total I : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseTotal1}
                    </span> 
                </Col>             
            </Col>
            {/* right grille */}
            <Col sm="6" style={{padding:'0px'}}>
                <Col className='inchange-case shadow p-2 mb-1 rounded'>
                    Player: 
                    <span className='text-rigth'>
                      {casePlayers}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Plus : 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {casePlus}
                    </span> 
                </Col> 
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Moins: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseMoins}
                    </span> 
                </Col>
                <Col className='inchange-case shadow-sm p-2 mb-1 rounded'>
                    Total II: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseTotal2}
                    </span> 
                </Col> 
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Suit: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseSuite}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Full: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseFull}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    Carré: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseCarre}
                    </span> 
                </Col>
                <Col style={caseStyle} className='shadow-sm p-2 mb-1 bg-white rounded'>
                    YAM: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseYam}
                    </span> 
                </Col>
                <Col className='inchange-case shadow-sm p-2 mb-1 rounded'>
                    Total III: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseTotal3}
                    </span> 
                </Col>     
                <Col className='inchange-case shadow-sm p-2 mb-1 rounded'>
                    Result: 
                    <span style={{display:'flex', alignItems:'center'}} className='text-rigth'>
                      {caseResult}
                    </span> 
                </Col>        
            </Col>
        </Col>
      </Row>
      
      <Row>     
        <Col sm="12" md={{ size: 6, offset: 3 }} id='dice-zone'>
          {diceList}
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }} id='buttons-zone'>
            <span style={{fontWeight:'700', fontSize:'1.3rem', color:'#0069D9'}}>LIFES : {gameCounter}</span>
            
            <span><Button disabled={gameCounter === 0} color="primary" onClick={()=>playGame()}>{!firstTime ? 'Roll Again' : 'Roll the dices!'}</Button></span>
          
            <span><Button disabled={firstTime} color="success" onClick={()=>handleJouer()}>Jouer!</Button></span>
        </Col>        
      </Row>
    </Container>
  );
}

export default Game;