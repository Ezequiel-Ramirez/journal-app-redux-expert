import { types } from "../types/types";
import { firebase, googleAuthProvider } from "../firebase/firebaseConfig";
import { startLoading, finishLoading } from "./ui";
import Swal from 'sweetalert2'

export const startLoginEmailPassword = (email, password) => {
    return (dispatch) => {
        dispatch(startLoading());

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(({ user }) => {
            dispatch(login(user.uid, user.displayName));

            dispatch(finishLoading());
        })
        .catch(err => {
            console.log(err);
            dispatch(finishLoading())
            Swal.fire('Error', err.message, 'error');
        });
};
};

export const startRegisterEmailPassword = (email, password, name) => {
    return (dispatch) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async ({ user }) => {
                await user.updateProfile({
                    displayName: name
                });
                dispatch(login(user.uid, user.displayName));
            })
            .catch(err => {
                console.log(err);
                Swal.fire('Error', err.message, 'error');
            });
    };
};

export const startGoogleLogin = () => {
    return (dispatch) => {
        firebase.auth().signInWithPopup(googleAuthProvider)
            .then(({ user }) => {
                dispatch(
                    login(
                        user.uid,
                        user.displayName,
                    )
                );
            })
    };
};




export const login = (uid, displayName) => {
    return {
        type: types.login,
        payload: {
            uid,
            displayName
        }
    }
}

export const startLogout = () => {
    return async (dispatch) => {
        await firebase.auth().signOut();
        dispatch(logout())
    }
}

export const logout = () => {
    return {
        type: types.logout
    }
}