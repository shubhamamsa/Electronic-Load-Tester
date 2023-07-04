import { PostRequest } from "./ApiRequests";

const sendRequest = (e) =>  {
    e.preventDefault();
    const batteryType = document.getElementById("batteryType");
    const batteryVersion = document.getElementById("batteryVersion");
    const threshold = document.getElementById("threshold");
    const mode = document.getElementById("mode");
    const desired = document.getElementById("desired");
    const charge = document.getElementById("charge");
    const capacity = document.getElementById("capacity");
    const error = document.getElementById("error");

    if(batteryType.value == null || batteryType.value === "")
        batteryType.value = "null";

    if(batteryVersion.value == null || batteryVersion.value === "")
        batteryVersion.value = 0;
    
        if(threshold.value == null || threshold.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Threshold value cannot be empty";
        return;
    }
    
    if(mode.value == null || mode.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Select a valid Mode";
        return;
    }
    
    if(desired.value == null || desired.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Enter desired set point";
        return;
    }

    if(charge.value == null || charge.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Enter the current charge of battery";
        return;
    }

    if(capacity.value == null || capacity.value === "")   {
        error.style.visibility = "visible";
        error.style.backgroundColor = "#d57489";
        error.innerHTML = "Enter the maximum capacity of battery";
        return;
    }

    const data = {
        type: batteryType.value,
        version: parseInt(batteryVersion.value),
        mode: parseInt(mode.value),
        val: parseFloat(desired.value),
        threshold: parseFloat(threshold.value),
        soc: parseFloat(charge.value),
        capacity: parseFloat(capacity.value),
    }
    PostRequest("power_profile", data).then((response) => {
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

function DischargeForm() {
    return(
        <div>
            <h2 style={{color: "#666666"}}>BATTERY PARAMETERS</h2>
            <form name="myForm" onSubmit={sendRequest} method="POST">
                <label htmlFor="batteryType">Battery Type:</label><br />
                <select name="batteryType" id="batteryType">
                <option value="LeadAcid">Lead Acid</option>
                <option value="LithiumIon">Lithium Ion</option>
                </select><br />
                <label htmlFor="batteryVersion">Battery Version:</label><br />
                <input type="number" id="batteryVersion" name="batteryVersion" placeholder="1000"/><br />

                <label htmlFor="threshold">Threshold Voltage:</label><br />
                <input type="number" step="0.01" id="threshold" name="threshold" placeholder="0V"/><br />
                
                <label htmlFor="mode">Mode of operation:</label><br />
                <select name="mode" id="mode">
                <option value="1">Constant Current</option>
                <option value="2">Constant Power</option>
                <option value="3">Constant Resistance</option>
                </select><br />
                
                <label htmlFor="desired">Desired Set Point:</label><br />
                <input type="number" step="0.01" id="desired" name="desired" placeholder="mA or mW or Ω" /><br />

                <label htmlFor="charge">Current Charge:</label><br />
                <input type="number" step="0.01" id="charge" name="charge" placeholder="100%"/><br />

                <label htmlFor="capacity">Maximum Capacity:</label><br />
                <input type="number" step="0.01" id="capacity" name="capacity" placeholder="1000mAh"/><br />
                <input type="submit" value="Submit" />
                <input type="reset" value="Reset" />
            </form>
            <p id="error" style = {{backgroundColor: "#d57489", padding: "15px", textAlign: "center", fontSize: "small", visibility: "hidden"}}> There was an error</p>
        </div>
    )
}

export default DischargeForm;