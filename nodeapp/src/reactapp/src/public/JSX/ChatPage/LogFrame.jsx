import { React } from "react";

import '../../CSS/LogFrame.css';

import LogContainerForAIModel from "./LogContainerForAIModel";
import LogContainerForAPI from "./LogContainerForAPI";

export default function LogFrame() {
    return (
        <div className="LogFrame">
            <LogContainerForAPI />
            <div></div>
        </div>
    )
}