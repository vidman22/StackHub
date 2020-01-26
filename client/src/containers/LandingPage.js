import React, { Component } from 'react';
import {Route, NavLink, Switch } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCubes} from '@fortawesome/free-solid-svg-icons';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import LoginModal from '../components/LoginModal/LoginModal';
import Login from './Login/Login';
import UserPage from './UserPage/UserPage';
import Stacks from './Stacks/Stacks';
import Pricing from './Pricing/Pricing';

import './LandingPage.css'


class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalShow: false,
        }
    }

    toggleModal() {
        this.setState( prevState => {
          return { loginModalShow: !prevState.loginModalShow }
        });
      }
    
    
    render() {
        
        return (
            <div>
                <Navbar bg="primary" variant="dark">
                 <NavItem><NavLink className="navbar-brand" activeClassName="active" to="/home"><FontAwesomeIcon size="2x" icon={faCubes}/></NavLink></NavItem>
                 <NavItem><NavLink className="navbar-brand" activeClassName="active" to="/home">StackHub</NavLink></NavItem>
                 <Nav className="mr-auto">
                   
                   <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-light"><FontAwesomeIcon icon={faSearch} /></Button>
                    </Form>
                 </Nav>
                 <NavDropdown title="Dropdown" variant="light" bg="light" id="basic-nav-dropdown">
                    <NavDropdown.Item><Nav.Link as={NavLink} to="/user">User Page</Nav.Link></NavDropdown.Item>
                    <NavDropdown.Item><Nav.Link as={NavLink} to="/stacks">Stacks</Nav.Link></NavDropdown.Item>
                    <NavDropdown.Item><Nav.Link as={NavLink} to="/user">Settings</Nav.Link></NavDropdown.Item>
                </NavDropdown>
                 <Button variant="outline-light" onClick={() => this.toggleModal()}>Sign In</Button>
                 
                </Navbar>
                <Switch>
                    <Route path="/stacks" component={Stacks} />
                    <Route path="/pricing" component={Pricing} />
                    <Route path="/user" component={UserPage} />
                </Switch>
                <LoginModal
                    component={<Login togglemodal={() => this.toggleModal()} />}
                    show={this.state.loginModalShow}
                    onHide={() => this.toggleModal()}
                />
            </div>
        );
    }
}

export default withRouter(LandingPage);
