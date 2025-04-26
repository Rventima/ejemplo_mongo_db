const toastContainer = document.getElementById("toastContainer");
const MAX_TOAST = 5;

export function displayNewToast(title, message, duration_in_ms){
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
}
    
window.addEventListener("load", () => displayNewToast(
    "Hola",
    "Bienvenido de nuevo.",
    5000
));



