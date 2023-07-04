import { PostRequest } from "./ApiRequests";

const sendRequest = (e) =>  {
    e.preventDefault();
    const resistance = document.getElementById("resistance");
    const error = document.getElementById("error");
    if(resistance.value == null || resistance.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Resistance cannot be empty";
        return;
    }
    const data = {
        mode: 3,
        val: resistance.value,
    }
    PostRequest("set_value", data).then((response) => {
        if(response.status !== 200) {
            error.style.visibility = "visible";
            error.innerHTML = response.statusText;
            error.style.backgroundColor = "#d57489";
        }
        else    {
            error.style.visibility = "visible";
            error.innerHTML = "Success, close the Window!"
            error.style.backgroundColor = "#9bf8c0";
        }
    })
}

function ResistanceForm() {
    return(
        <div>
            <h2 style={{color: "#666666"}}>CONSTANT RESISTANCE MODE</h2>
            <form name="ResistanceForm" onSubmit={sendRequest} method="POST">
                <label htmlFor="Resistance">Desired Resistance:</label><br />
                <input type="number" step="0.01" id="resistance" name="resistance" placeholder="0Ω" /><br />
                
                <input type="submit" value="Submit" />
                <input type="reset" value="Reset" />
            </form>
            <p id="error" style = {{backgroundColor: "#d57489", padding: "15px", textAlign: "center", fontSize: "small", visibility: "hidden"}}> There was an error</p>
        </div>
    )
}

export default ResistanceForm;