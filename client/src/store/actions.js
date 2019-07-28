import { AUTH_TOKEN } from '../constants'; 
import * as actionTypes from './actionTypes';

const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const authSuccess = ( id, email, username, picture, uuid, token, expiresIn) => {
    console.log('picture', picture);
	const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem(AUTH_TOKEN, token);
    localStorage.setItem('id', id);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('uuid', uuid);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('picture', picture);

    return {
        type: actionTypes.AUTH_SUCCESS,
        id,
        email,
        username,
        picture,
        uuid
    };
};

export const autoLogin = (id, email, username, picture, uuid, token, expiresIn ) => {
	return {
        type: actionTypes.AUTH_SUCCESS,
        id,
       	email,
       	username,
       	picture,
        uuid   
    }
}

// export const authFail = (error) => {
//     return {
//         type: actionTypes.AUTH_FAIL,
//         error: error
//     };
// };

export const authCheckState = () => {
	return dispatch => {
			const token = localStorage.getItem(AUTH_TOKEN);
			if (!token) {
				dispatch(logout())
			} else {
				const expirationDate = new Date(localStorage.getItem('expirationDate'));
				if (expirationDate <= new Date()) {
					dispatch(logout());
				} else {
                    //const id = localStorage.getItem('id');
					const id = parseInt(localStorage.getItem('id'), 10);
					const picture = localStorage.getItem('picture');
					const email = localStorage.getItem('email');
                    const username = localStorage.getItem('username');
                    const uuid = localStorage.getItem('uuid');
					dispatch(autoLogin(id, email, username, picture, token, uuid ));
					dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
				}
			}
		}
}

export const logout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem('id');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('uuid');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('picture');
    
    return {
    	type: actionTypes.LOGOUT
    };
}

