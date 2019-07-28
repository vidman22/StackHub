import React, { Component } from 'react';
import {Route, NavLink, Switch } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCubes} from '@fortawesome/free-solid-svg-icons';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
import { withRouter } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import LoginModal from '../components/LoginModal/LoginModal';
import Login from './Login/Login';
import UserPage from './UserPage/UserPage';
import Stacks from './Stacks/Stacks';
import Pricing from './Pricing/Pricing';


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
                   <NavItem><NavLink className="nav-link" activeClassName="active" to="/user" onClick={() => this.toggleModal()}>Account</NavLink></NavItem>
                   <NavItem><NavLink className="nav-link" activeClassName="active" to="/stacks">Stacks</NavLink></NavItem>
                   <NavItem><NavLink className="nav-link" activeClassName="active" to="/pricing">Pricing</NavLink></NavItem>
                   <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-light"><FontAwesomeIcon icon={faSearch} /></Button>
                 </Form>
                 </Nav>
                 <Button variant="outline-light" onClick={() => this.toggleModal()}>Sign In</Button>
                </Navbar>
                <Switch>
                    <Route path="/stacks" component={Stacks} />
                    <Route path="/pricing" component={Pricing} />
                    <Route path="/user" component={UserPage} />
                </Switch>
                <LoginModal
                    component={<Login  />}
                    show={this.state.loginModalShow}
                    onHide={() => this.toggleModal()}
                />
            </div>
        );
    }
}

export default withRouter(LandingPage);
