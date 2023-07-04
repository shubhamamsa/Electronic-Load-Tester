import { PostRequest } from "./ApiRequests";

const sendRequest = (e) =>  {
    e.preventDefault();
    const current = document.getElementById("current");
    const error = document.getElementById("error");
    if(current.value == null || current.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Current cannot be empty";
        return;
    }
    const data = {
        mode: 1,
        val: current.value,
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

function CurrentForm() {
    return(
        <div>
            <h2 style={{color: "#666666"}}>CONSTANT CURRENT MODE</h2>
            <form name="currentForm" onSubmit={sendRequest} method="POST">
                <label htmlFor="current">Desired Current:</label><br />
                <input type="number" step="0.01" id="current" name="current" placeholder="0mA" /><br />
                
                <input type="submit" value="Submit" />
                <input type="reset" value="Reset" />
            </form>
            <p id="error" style = {{backgroundColor: "#d57489", padding: "15px", textAlign: "center", fontSize: "small", visibility: "hidden"}}> There was an error</p>
        </div>
    )
}

export default CurrentForm;