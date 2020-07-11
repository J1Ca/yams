import React, { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom';
import './yams.css';
import { 
    Button,
    Label, 
    Input, 
    Row, 
    Container,
    Col,
    FormGroup,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

function Home() {
    const [players, setPlayers] = useState('');
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [player3, setPlayer3] = useState(null);
    const [startGame, setStartGame] = useState(false);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('localGame')){
            setStartGame(true)
        }
    }, [])

    //creating inputs
    let playersInputs = [];
    if (players !== '') {
        for (let i=0;i<players;i++){
            let label = 'Player'+(i+1)
            playersInputs.push(
                <FormGroup key={i}>
                    <Label>{label}</Label>
                    <Input onChange={(e) => addPlayerState(label, e.target.value)} type="text" key={i} name={label} placeholder="Your name" />
                </FormGroup>
            )
        }        
    }

    const addPlayerState = (label, info) => {
        if (label === 'Player1') {
            setPlayer1(info)
        } else if (label === 'Player2') {
            setPlayer2(info)
        } else if (label === 'Player3'){
            setPlayer3(info)
        }
    }
    
    const localStockPlayers = ()=> {
        const startGrille = [
            {id: 0, name: 'As', value: null, fill: false},
            {id: 1, name: 'Deux', value: null, fill: false},
            {id: 2, name: 'Trois', value: null, fill: false},
            {id: 3, name: 'Quatre', value: null, fill: false},
            {id: 4, name: 'Cinq', value: null, fill: false},
            {id: 5, name: 'Six', value: null, fill: false},
            {id: 6, name: 'Plus', value: null, fill: false},
            {id: 7, name: 'Moins', value: null, fill: false},
            {id: 8, name: 'Suite', value: null, fill: false},
            {id: 9, name: 'Full', value: null, fill: false},
            {id: 10, name: 'Carré', value: null, fill: false},
            {id: 11, name: 'YAM', value: null, fill: false},        
        ]

        if(player1 === null && player2 === null && player3 === null){
            setModal(true)
        } else {
            let allPlayers = [];
            if (player1 !== null) {
                allPlayers.push({
                    name:player1,
                    lastRoll: 0,
                    grille: startGrille
                })
            }    
            if (player2 !== null) {
                allPlayers.push({
                    name:player2,
                    lastRoll: 0,
                    grille: startGrille
                })
            }   
            if (player3 !== null) {
                allPlayers.push({
                    name:player3,
                    lastRoll: 0,
                    grille: startGrille
                })
            }   
            //stocking local game               
            localStorage.setItem('localGame', JSON.stringify(allPlayers))
            localStorage.setItem('globalCounter', 1)    
            setStartGame(true)
        }
    }   

    //goin to gamePage
    if (startGame){
        return <Redirect to='/game'/>
    }

  return (
    <Container style={{marginTop: '50px'}}>
        <Modal isOpen={modal}>
            <ModalHeader>OOOPS !</ModalHeader>
            <ModalBody>
                You have to add at least one player
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={()=>setModal(false)}>got it!</Button>
            </ModalFooter>
        </Modal>
        
        <Row>
            <Col style={{margin:'50px', color:'#0069D9'}} className='text-center'>
                <span style={{marginRight:'15px', fontWeight:'700', fontSize:'3rem', color:'#0069D9'}}>YAMS !</span>
            </Col>        
        </Row>
        <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
                <FormGroup>
                    <Label for="exampleSelect">How many players?</Label>
                    <Input onChange={(e) => setPlayers(e.target.value)} type="select">
                        <option></option>  
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </Input>
                </FormGroup>

                {playersInputs}

                <Button color='primary' onClick={()=>localStockPlayers()}>Go !</Button>                                              
            </Col>
        </Row>
    </Container>
  );
}

export default Home;