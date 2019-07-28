import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Mutation, graphql } from 'react-apollo';
import { withRouter} from 'react-router';
import GitHub from '../../assets/svg/github';
import Google from '../../assets/svg/google';
import gql from 'graphql-tag';
import GoogleLogin from 'react-google-login';

// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import './Login.css';

import * as actions from '../../store/actions';


import PasswordValidator from 'password-validator';

const schema = new PasswordValidator();

schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase() 
    .has().symbols()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);


const SIGNUP_MUTATION = gql`
  mutation ( $email: String!, $password: String!) {
    signUp( email: $email, password: $password) {
        token
        expiresIn
        user {
            id
            email  
        }
    }
}
`;

const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
        token
        expiresIn
        user {
            id
            email
        }
    }
}
`;

const CLIENT_ID = "24ca8fa951d319378bb7";

const REDIRECT_URI = "http://localhost:3000/user";

class Login extends Component {
    constructor(props){
        super(props);
    this.state = {
      form: {
        username: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        },
        password: {
            value:'',
            valid: false,
            touched: false,
            msg: [],
            style: '',
        },
        email: {
            value:'',
            valid: false,
            touched: false,
            msg: '',
            style: '',
        }
      },
        formIsValid: false,
        isLogin: false,
        showErrorMessages: false
    }
    this.checkValidity = this.checkValidity.bind(this);
  } 


    checkValidity () {
       const form = this.state.form;
       let formIsValid;
       if (this.state.isLogin) {
        formIsValid = form.email.valid && form.password.valid;
       } else {
            formIsValid = form.email.valid && form.password.valid;
        }
        this.setState({formIsValid});
    }

    inputChangedHandler = ( event, controlName ) => {
        const updatedForm = {
            ...this.state.form
        }

        const updatedElement = {
            ...updatedForm[controlName]
        }


        updatedElement.value = event.target.value;
        let value = updatedElement.value.trim();

        if (controlName === 'email') {
            
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            const isValid = pattern.test( value );
            if (isValid) {
                updatedElement.valid = true;
                updatedElement.msg = '';
                updatedElement.style = '';
            } else {
                updatedElement.msg = 'Enter a valid email';
                updatedElement.valid = false;
                updatedElement.style = 'invalid';
            }
        }

        if (controlName === 'password') {

            const isValid = schema.validate(value);
                updatedElement.valid = isValid;
            if (isValid) {
                updatedElement.msg = [];
                updatedElement.style = '';
            } else {
                let messages = schema.validate(value, {list: true});
                updatedElement.style = 'invalid';
                let flags = [];
                for (let i =0; i < messages.length; i++){
                    if (messages[i] === 'min') {
                        flags.push('Minimum length is 8 characters')
                    }
                    if (messages[i] === 'uppercase') {
                        flags.push('Use at least one uppercase letter')
                    }
                    if (messages[i] === 'lowercase') {
                        flags.push('Use at least one lowercase letter')
                    }
                    if (messages[i] === 'symbols') {
                            flags.push('Use at least one symbol')
                    }
                    if (messages[i] ===  'digits') {
                            flags.push('Use at least one digit')
                    }
                    if (messages[i] ===  'oneOf') {
                            flags.push('Weak password')
                    }
                    if (messages[i] === 'maximum') {
                        flags.push('Password is too long')
                    }
                }
                updatedElement.msg = flags;
                this.setState({showErrorMessages: true});
            }

        }

        updatedElement.touched = true;

        updatedForm[controlName] = updatedElement;

        this.setState({ 
            form : updatedForm 
        },() => {
            this.checkValidity(); 
        });
        
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    _oAuthMutation = async (Type, Email, Username, Picture, Uuid, Token, ExpiresIn) => {
      
        const result = await this.props.oAuthMutation({
            variables: {
                type: Type,
                email: Email,
                username: Username,
                picture: Picture,
                uuid: Uuid,
                token: Token,
                expiresIn: ExpiresIn
            }
        });  
        
        const resultId = result.data.oAuthSignIn.user.id;
        const { token, expiresIn } = result.data.oAuthSignIn;
        //const resultUserTableID = result.data.oAuthSignIn.user.id;
        const resultEmail = result.data.oAuthSignIn.user.email;
        const resultUsername = result.data.oAuthSignIn.user.username;
        const resultPicture = result.data.oAuthSignIn.user.picture;
        const resultUserID = result.data.oAuthSignIn.user.uuid;
        
        
        this.props.onAuth( resultId, resultEmail, resultUsername, resultPicture, resultUserID, token, expiresIn);

    }

    responseGoogle = (response) => {
          let email,
           username,
            picture,
               userID,
              token,
          expiresIn;
        
        if (response.profileObj) {
         email = response.profileObj.email;
           username = response.profileObj.givenName;
            picture = response.profileObj.imageUrl;
             userID = response.profileObj.googleId;
              token = response.tokenId;
          expiresIn = response.tokenObj.expires_in*48;
       }

        this.props.togglemodal();
        this._oAuthMutation('google', email, username, picture, userID, token, expiresIn);
    }

    completed = (data) => {
        console.log("completed data", data);
        this.props.togglemodal();
        this.props.history.push('/user');
        let id;
        let email;
       
        let picture;
        let uuid;
        let token;
        let expiresIn;
        
        for (let property in data) {
           id = data[property].user.id;
           email = data[property].user.email;
           picture = data[property].user.picture;
           uuid = data[property].user.uuid;
           token = data[property].token;
           expiresIn = data[property].expiresIn;
        }
        this.props.onAuth(id, email, picture, uuid, token, expiresIn);
    }

    render () {
        
        const login = this.state.isLogin;
        const email = this.state.form.email.value;
        const password = this.state.form.password.value;
        let variables;
        if (login) {
            variables = {variables: {email, password}}
        } else variables = {variables: { email, password}}


        return (

            <div className="Auth">
             <Mutation
                mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                onCompleted={data => this.completed(data)}
             >
                {(mutation, {loading, error}) => (
                <div>
                    {login ? <h2>Login</h2> : <h2>Sign Up</h2>}
                    <form onSubmit={e => {
                        e.preventDefault();
                        mutation(variables);
                        }}>
                    <input
                        className={this.state.form.email.style} 
                        value={this.state.form.email.value}
                        onChange={( e ) => this.inputChangedHandler(e , 'email')}
                        type="email"
                        placeholder="email"
                    />
                    {false ? <div className="EmailError"><p>{this.state.form.email.msg}</p></div> : null}
                    <input
                        className={this.state.form.password.style}  
                        value={this.state.form.password.value}
                        onChange={( e ) => this.inputChangedHandler(e , 'password')}
                        type="password"
                        placeholder="password"
                    />
                    {this.state.showErrorMessages.length && !login ? <div className="PasswordMessages"><ul>{this.state.form.password.msg.map((amsg, index) => (
                        <li><p key ={index}>{amsg}</p></li>
                    ))}</ul></div> : null}
                        <button type="submit" className="AuthButton" disabled={!this.state.formIsValid}>
                            {login ? 'LOGIN' : 'CREATE AN ACCOUNT'}
                        </button>
                </form>
                {loading && <div className="spinner spinner-1"></div>}
                {error ? <div>{error.message}</div> : null}
               </div>    
             )}
             </Mutation>
                
              <button className="SwitchAuthButton" onClick={this.switchAuthModeHandler}>{ login ? 'SWITCH TO SIGN UP' : 'ALREADY SIGNED UP?'}</button>
                {/* <button 
                  className="GoogleLogin" 
                  onClick={() => this.gitHubLogin("24ca8fa951d319378bb7", )}>Continue with GitHub</button> */}
                  <a className="SocialLogin" href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user,gist&redirect_uri=${REDIRECT_URI}`}>
                    <GitHub /> <div className="SocialText">Continue with Github</div>
                  </a>

                    <GoogleLogin
                        
                        clientId='99023560874-es09obh5s0o70hd5j3lstp9lagsq395d.apps.googleusercontent.com'
                        buttonText={`Continue with Google`}
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        render={ renderProps => (
                          
                            <div className="SocialLogin" onClick={renderProps.onClick}>
                                <Google />
                                <div className="SocialText">Continue with Google</div>
                            </div> 
                    )}/> 
            </div>
        );
    }
};

const OAUTH_MUTATION = gql`
    mutation($type: String!, $email: String!, $picture: String, $uuid: String!, $token: String!, $expiresIn: Int ) {
        oAuthSignIn( type: $type, email: $email, picture: $picture, uuid: $uuid, token: $token, expiresIn: $expiresIn) {
            token
            expiresIn
            user {
                id
                email
                username
                uuid
                picture
            }
        }
    }
`;



const mapDispatchToProps = dispatch => {
    return {
        onAuth:(id, email, name, picture, uuid, token, expiresIn ) => dispatch( actions.authSuccess(id, email, name, picture, uuid, token, expiresIn))
    };
};
const Container = graphql( OAUTH_MUTATION, { name: 'oAuthMutation' })(withRouter(Login));
export default connect( null , mapDispatchToProps )( Container );