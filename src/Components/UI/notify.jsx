import {toast} from "react-toastify";

export const notify =  (text, bg = 'green')=>{
    toast(text, {
        position: 'bottom-right',
        autoClose: 1000,
        style: {
            backgroundColor: bg,
            color: "white",
            borderRadius: "8px",
            padding: "12px 18px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "16px",
        }

    })
}