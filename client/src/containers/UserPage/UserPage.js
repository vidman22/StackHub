import React, { Component } from 'react';
import queryString from 'query-string';
const CLIENT_ID = "24ca8fa951d319378bb7";

const REDIRECT_URI = "http://localhost:3000/user";

class UserPage extends Component {
    constructor() {
        super();
        this.state = { data: [] };
      }

    async componentDidMount() {
        let client_secret = "f76873b166dc1adbd09cd835891ef08e8c43bbd7";
        const {code} = queryString.parse(this.props.location.search);
        console.log("type of", typeof code);
        console.log(code);
        let data = new FormData()
            data.append('client_id', CLIENT_ID)
            data.append('client_secret', client_secret)
            data.append('code', code)
            data.append('redirect_uri', REDIRECT_URI)
        if (code) {
            let response = await fetch(`https://github.com/login/oauth/access_token`, {
                headers: {
                    // 'Accept': 'application/xml',
                    // 'Access-Control-Allow-Origin': "*"
                },
                method: "POST",
                mode: "no-cors",
                body: data
            });
            console.log(response);
            //const json = await response.json();
            //this.setState({ data: json });
        }
    }

    // async gitHubLogin(code) {
    //     console.log("code", code);
    //     let response = await fetch(`https://github.com/login/oauth/access_token/${code}`, {
    //         method: "POST",
    //         headers: {"Content-Type": "text/plain"},
    //         mode: "no-cors"
    //     })
    //         .then(response => response.json())
    //         .then(({ token }) => {
    //             console.log("token", token);
    //         });
    //   }

    render() {
        return (
            <div>
                <h1>User Page</h1>
            </div>
        );
    }
}

export default UserPage;
