export const {SET_IDS, PUSH_IDS} = {
    SET_IDS: 0,
    PUSH_IDS: 1
}

const idsReducer = (state, action) => {
    switch (action.type) {
        case SET_IDS:
            return action.payload;
        case PUSH_IDS:
            const key = Object.keys(action.payload)[0];
            const value = Object.values(action.payload)[0];
            return {
                ...state,
                [key]: state[key].concat(value)
            };
    }
}

export default idsReducer;

export const idsInitState = {
    
}