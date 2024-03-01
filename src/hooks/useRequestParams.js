import { useReducer} from "react";
import requestParamsReducer, { requestParamsInitState } from "../reducers/requestParamsReducer";

export const useRequestParams = () => {
    const [params, dispatch] = useReducer(requestParamsReducer, requestParamsInitState);


    return [params.page+1, params.filter, dispatch]
}