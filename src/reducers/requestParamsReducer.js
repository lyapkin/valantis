export const {FILTER, PAGE_NEXT, PAGE_PREV} = {
    FILTER: 0,
    PAGE_NEXT: 1,
    PAGE_PREV: 2
}

const requestParamsReducer = (state, action) => {
    switch (action.type) {
        case FILTER:
            return {
                ...state,
                filter: action.payload,
                page: 0
            }
        case PAGE_NEXT:
            return {
                ...state,
                page: state.page + 1
            }
        case PAGE_PREV:
            return {
                ...state,
                page: state.page - 1
            }
    }
}

export default requestParamsReducer;

export const requestParamsInitState = {
    filter: {
        product: "",
        price: null,
        brand: ""
    },
    page: 0
}