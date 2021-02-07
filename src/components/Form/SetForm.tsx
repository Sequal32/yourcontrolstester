import React from 'react';
import FormField from './FormField'
import '../../css/Shared.css'
import {GenericVarForm, GenericVarFormState, Props} from './GenericVarForm';
import {invoke} from 'tauri/api/tauri';

class SetFormState extends GenericVarFormState {
    param: string | null = null;
    value: string | null = null;
    indexReversed: boolean = false;
}

class SetForm extends GenericVarForm<SetFormState> {
    state: SetFormState = new SetFormState()

    paramChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({param: e.target.value})
    }

    valueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({value: e.target.value})
    }

    indexChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({
            indexReversed: e.target.checked
        })
    }

    setCalculator(newStateChange: {name?: string, units?: string, param?: string, value?: string, indexReversed?: boolean}) {
        let code = ""

        const name = newStateChange.name ?? this.state.name
        const units = newStateChange.units ?? this.state.units
        const param = newStateChange.param ?? this.state.param
        const value = newStateChange.value ?? this.state.value
        const indexReversed = newStateChange.indexReversed ?? this.state.indexReversed

        const nameString = name ?? ""
        const unitsString = units ?? ""
        let paramString = param ? param + " " : ""
        let valueString = value ? value + " " : ""

        if (indexReversed) {
            const temp = paramString
            paramString = valueString
            valueString = temp
        }

        if (this.isKey(name) || this.isLocal(name)) {

            code = `${paramString}${valueString}(>${nameString})`

        } else {

            // Default to A:
            const prefixedName = !nameString.match(/\w:/) ? "A:" + nameString : nameString

            code = `${paramString}${valueString}(>${prefixedName}, ${unitsString})`

        }

        this.setState({
            calculator: code,
            name, units, param, value, indexReversed
        })
    }

    handleSubmit() {
        invoke({
            cmd: "setVar",
            data: {
                calculator: this.state.calculator
            }
        })
    }

    componentDidUpdate(prevProps: Props) {
        // Changed from last update 
        const newDefinition = this.props.definitionOverride

        if (prevProps.definitionOverride != newDefinition && newDefinition != undefined) {
            const {event_name, event_param, var_name, var_units, index_reversed, set, type} = newDefinition

            if (event_name || var_name) {
                const name = event_name ? (event_param && type == "NumSet" ? "K:2:" + event_name : "K:" + event_name) : var_name

                this.setCalculator({
                    name,
                    units: var_units ?? "",
                    param: event_param ?? "",
                    indexReversed: index_reversed ?? false
                })

            } else if (set) {

                this.setState({
                    calculator: set
                })

            }
            
        }
    }
    
    render() {
        return (
            <div className="form">
                <FormField id="single" type="text" label="Name" overrideValue={this.state.name ?? ""} onChange={this.nameChange.bind(this)}/>
                <FormField id="units" type="text" label="Units" overrideValue={this.state.units ?? ""} onChange={this.unitsChange.bind(this)} disabled={this.isKey() || this.isLocal()}/>
                <FormField id="param" type="text" label="Param" overrideValue={this.state.param ?? ""} onChange={this.paramChange.bind(this)} disabled={!this.isKey()}/>
                <FormField id="value" type="text" label="Value" overrideValue={this.state.value ?? ""} onChange={this.valueChange.bind(this)}/>
                <FormField id="calculator" type="text" label="Calculator Code" widthPercent={100} overrideValue={this.state.calculator} onChange={this.calculatorChange.bind(this)}/>
                <div style={{width: "100%"}}>
                    <input type="checkbox" onChange={this.indexChange.bind(this)} checked={this.state.indexReversed}></input>
                    <label>Index Reversed?</label>
                </div>

                <button className="form-button rounded shadow" onClick={this.handleSubmit.bind(this)}>Set</button>
            </div>
        )
    }
}

export default SetForm;