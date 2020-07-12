import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { Redirect } from 'react-router-dom';


const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resetGame, setResetGame] = useState(false)


  const toggle = () => setIsOpen(!isOpen);

  if(resetGame){return <Redirect to='/'/>}

  return (
    <div>
      <Navbar color="white" light expand="md">
        <NavbarBrand style={{marginRight:'15px', fontWeight:'700', fontSize:'1.5rem', color:'#0069D9'}}>YAMS !</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="http://www.stratozor.com/yams-rules.php" target="_blank">Les regles</NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Reset Game
              </DropdownToggle>
              <DropdownMenu right>
                <NavbarText style={{marginLeft:'10px'}}>
                    Se perderan todos los datos :o, are you sure?
                </NavbarText>
                <DropdownItem divider />
                <DropdownItem onClick={()=>{toggle();localStorage.clear(); setResetGame(true)}}>
                  Yes, reset game!
                </DropdownItem>
                <DropdownItem onClick={()=>toggle()}>
                  No, I keep playing :
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <NavbarText>Created by Jose Luis</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default NavBar;