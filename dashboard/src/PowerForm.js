import { PostRequest } from "./ApiRequests";

const sendRequest = (e) =>  {
    e.preventDefault();
    const power = document.getElementById("power");
    const error = document.getElementById("error");
    if(power.value == null || power.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Power cannot be empty";
        return;
    }
    const data = {
        mode: 2,
        val: power.value,
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

function PowerForm() {
    return(
        <div>
            <h2 style={{color: "#666666"}}>CONSTANT POWER MODE</h2>
            <form name="PowerForm" onSubmit={sendRequest} method="POST">
                <label htmlFor="Power">Desired Power:</label><br />
                <input type="number" step="0.01" id="power" name="power" placeholder="0mW" /><br />
                
                <input type="submit" value="Submit" />
                <input type="reset" value="Reset" />
            </form>
            <p id="error" style = {{backgroundColor: "#d57489", padding: "15px", textAlign: "center", fontSize: "small", visibility: "hidden"}}> There was an error</p>
        </div>
    )
}

export default PowerForm;