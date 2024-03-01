import md5 from "md5";

export function getTodayDate() {
    const date = new Date();
    let month = (date.getUTCMonth()+1).toString();
    let day = (date.getUTCDate()).toString();
    
    if (month.length < 2)
        month = "0" + month;
    if (day.length < 2)
        day = "0" + day;

    return date.getUTCFullYear() + month + day;
}

export function getAuth() {
    return md5("Valantis_" + getTodayDate());
}