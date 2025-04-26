
import { displayNewToast } from "../components/toast/toast.js";

const testButton = document.getElementById("testButton");
testButton.addEventListener("click",() => fetchUserByEmail("q@qwqeqqw"));

async function fetchUserByEmail(email) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);//5000ms para esperar respuesta

    try{
        const response = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(email)}`,{
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const userData = await response.json();
        console.log("Datos del usuario: ", userData);
        
    }catch(error){
        console.error("Error en consulta: ",error.message );
    }    
}
