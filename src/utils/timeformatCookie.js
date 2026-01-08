import Cookies from 'js-cookie'

export function getTimeFormatCookie(){
    return Cookies.get("timeformat_cookie")
}

export function setTimeFormatCookie(format){
    Cookies.set("timeformat_cookie", format, {
        expires : 365,
        sameSite: 'Lax'
    })
}