import { SET_CURRENT_USER,ERRORS,SUCCESSFUL_REGISTER } from "../actions/types";
import { isEmpty } from "lodash";

const initialState = {
    isAuthenticated: false,
    token: localStorage.getItem("token"),
    user: {}
}

export default function authReducer(state=initialState, action){
    const {payload} = action
    switch(action.type){
        case SET_CURRENT_USER:
            return{
               ...state,
               isAuthenticated: !isEmpty(action.payload),
               user: payload 
            }
        case SUCCESSFUL_REGISTER:
            localStorage.setItem("token", payload.token)
            return{
                ...state,
                ...payload,
                isAuthenticated: true,
            }
        case ERRORS:
            localStorage.removeItem("token")
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                
            }
        default:
            return state;
    }
}