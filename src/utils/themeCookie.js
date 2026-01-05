import Cookies from 'js-cookie'
import { Cookie } from 'lucide-react'

export function getThemeCookie(){
    return Cookies.get("askzyla_theme")
}

export function setThemeCookie(theme){
    Cookies.set("askzyla_theme", theme, {
        expires : 365,
        sameSite: 'Lax'
    })
}