import DischargeForm from './DischargeForm.js'
import CurrentForm from './CurrentForm.js'
import PowerForm from './PowerForm.js'
import ResistanceForm from './ResistanceForm.js'
import './FormHandler.css'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import { PostRequest } from "./ApiRequests";

function FormHandler() {
    return(
        <>
            <div id="button-action">
                <Popup trigger={<button className="button"> Start Battery Discharge </button>} modal nested>
                    <div id="dischargeForm">
                        <DischargeForm />
                    </div>
                </Popup>
                <Popup trigger={<button className="button"> Set Current </button>} modal nested>
                    <div id="dischargeForm">
                        <CurrentForm />
                    </div>
                </Popup>
                <Popup trigger={<button className="button"> Set Power </button>} modal nested>
                    <div id="dischargeForm">
                        <PowerForm />
                    </div>
                </Popup>
                <Popup trigger={<button className="button"> Set Resistance </button>} modal nested>
                    <div id="dischargeForm">
                        <ResistanceForm />
                    </div>
                </Popup>
                <button id="reset" className="button" onClick={() => {PostRequest("reset", "{}")}}> RESET </button>
            </div>
        </>
    )
}

export default FormHandler;