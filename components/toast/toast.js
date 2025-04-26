const toastBtn = document.getElementById("toastBtn");
const toastContainer = document.getElementById("toastContainer");
const MAX_TOAST = 5;

async function displayNewToast(title, message, duration_in_ms){
    const toastTemplate = document.getElementById("miToast");
    const newToast = toastTemplate.cloneNode(true);

    newToast.querySelector('.toast-header strong').textContent = title;
    newToast.querySelector('.toast-body').textContent = message;

    toastContainer.appendChild(newToast)

    if(toastContainer.children.length > MAX_TOAST){
        toastContainer.removeChild(toastContainer.children[0]);
    }

    const bsToast = new bootstrap.Toast(newToast, {
        autohide : true,
        delay : duration_in_ms


    });
    bsToast.show()
    try{
        const response = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(mail)}`);
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`);

        }
        const userData = await response.json();
        console.log("Datos del usuario: ", userData);

    }catch(error){
        console.error("Error en consulta: ",error.message );
    }
}

toastBtn.addEventListener("click", () => displayNewToast(
    "Click", 
    "Hiciste click.",
    1000
));
    
window.addEventListener("load", () => displayNewToast(
    "Hola",
    "Bienvenido de nuevo.",
    5000
));




