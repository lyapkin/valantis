export const {FILTER, PAGE_NEXT, PAGE_PREV, CHANGE_OFFSET_ERROR} = {
    FILTER: 0,
    PAGE_NEXT: 1,
    PAGE_PREV: 2,
    CHANGE_OFFSET_ERROR: 3
}

const requestParamsReducer = (state, action) => {
    switch (action.type) {
        case FILTER:
            return {
                ...state,
                filter: action.payload,
                pagination: {
                    page: 0,
                    offsetError: 0
                }
            }
        case PAGE_NEXT:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: state.pagination.page + 1
                }
            }
        case PAGE_PREV:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: state.pagination.page - 1
                }
            }
        case CHANGE_OFFSET_ERROR:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    offsetError: action.payload
                }
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
    pagination: {
        page: 0,
        offsetError: 0
    }
}