document.addEventListener('DOMContentLoaded',()=>{
    const alertToastTemplate = document.getElementById("alertToast");
    const formulario = document.getElementById("formulario-bienvenida");
    const toastContainer = document.getElementById("toastAlertContainer");
    const showPwdButton = document.getElementById("displayPswButton");
    const passwordInput = document.getElementById("inputPassword");

    showPwdButton.addEventListener("click",() => {

        if(!showPwdButton.toggle){
            showPwdButton.toggle = !showPwdButton.toggle;
            showPwdButton.innerHTML = "🙉 Ocultar contraseña";
            passwordInput.type="text";
            return;
        }
        showPwdButton.toggle = !showPwdButton.toggle;
        showPwdButton.innerHTML = "🙈 Mostrar contraseña";
        passwordInput.type="password";
    });

    formulario.addEventListener("submit", async (e) =>{

        e.preventDefault();

        const mail = document.getElementById("inputMail").value;
        const password = passwordInput.value;
        const esEstudianteUAM = document.getElementById("esEstudianteUAM").checked;

        if(toastContainer.children.length >= 1){
            toastContainer.removeChild(toastContainer.children[0]);
        }
        
        if(!mail){
            showAlertToast("Ingresa un correo");
            return;
        }

        const regexPwdTest = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,}$/;

        const passwordHelp = document.getElementById("passwordHelp"); //pass requirements
        const textOriginalColor = passwordHelp.style.color; //retrieve bootstrap color for this class

        if(!regexPwdTest.test(password)){    
            passwordHelp.style="color: red;"
            showAlertToast("Ingresa una contraseña válida");
            return;
        }
        passwordHelp.style= textOriginalColor //devuelve a su color original si la pwd es válida.

        try{
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: mail,
                    password: password,
                    esEstudianteUAM: esEstudianteUAM
                    
                })
            });

            const data = await response.json();

            if(!response.ok){
                showAlertToast(data.error || "Error en el registro");
                return;
            }
            showAlertToast("Registro exitoso!");
            formulario.reset();

        }catch(error){
            showAlertToast("Error de conexión a la DB");
        }

    });

    function showAlertToast(title){
        const newAlertToast = alertToastTemplate.cloneNode(true);
        newAlertToast.querySelector(".toast-header strong").textContent = title;

        toastContainer.appendChild(newAlertToast)

        const bsToast = new bootstrap.Toast(newAlertToast, {
            autohide: false
        });

        bsToast.show();
    }
});