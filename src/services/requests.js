import { getAuth } from '../util';


export const toRequest = async body => {
    const response = await fetch("http://api.valantis.store:40000/", {
        headers: {
            "X-Auth": getAuth(),
            "Content-Type": "application/json"
        },
        method: "POST",
        body
    });
    if (response.ok) {
        return (await response.json()).result;
    }
    console.log("Ошибка id:", await response.text());
    return await toRequest(body);
}
