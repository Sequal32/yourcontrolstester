import React from 'react';
import FormField from './FormField'
import '../../css/Shared.css'
import {GenericVarForm, GenericVarFormState} from './GenericVarForm';
import {invoke} from 'tauri/api/tauri';

class SetFormState extends GenericVarFormState {
    param: string | null = null;
    value: string | null = null;
}

class SetForm extends GenericVarForm<SetFormState> {
    state: SetFormState = new SetFormState()

    paramChange(e: React.ChangeEvent<HTMLInputElement>) {
        const param = e.target.value == "" ? undefined : e.target.value
        this.setCalculator({param})
    }

    valueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value == "" ? undefined : e.target.value
        this.setCalculator({value})
    }

    setCalculator(newStateChange: {name?: string, units?: string, param?: string, value?: string}) {
        let code = ""

        const name = newStateChange.name ?? this.state.name
        const units = newStateChange.units ?? this.state.units
        const param = newStateChange.param ?? this.state.param
        const value = newStateChange.value ?? this.state.value

        const nameString = name ?? ""
        const unitsString = value ?? ""
        const paramString = param ? param + " " : ""
        const valueString = value ? value + " " : ""

        if (this.isKey() || this.isLocal()) {

            code = `${paramString}${valueString}(>${nameString})`

        } else if (this.isAircraft()) {

            code = `${paramString}${valueString}(>${nameString}, ${unitsString})`

        } else {
            // Name not defined yet
            code = `${valueString}(>, ${unitsString})`

        }

        this.setState({
            calculator: code,
            name, units, param, value
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
    
    render() {
        return (
            <div className="form">
                <FormField id="single" type="text" label="Name" onChange={this.nameChange.bind(this)}/>
                <FormField id="units" type="text" label="Units" onChange={this.unitsChange.bind(this)} disabled={this.isKey() || this.isLocal()}/>
                <FormField id="param" type="text" label="Param" onChange={this.paramChange.bind(this)}/>
                <FormField id="value" type="text" label="Value" onChange={this.valueChange.bind(this)}/>
                <FormField id="calculator" type="text" label="Calculator Code" widthPercent={100} overrideValue={this.state.calculator} onChange={this.calculatorChange.bind(this)}/>
                <button className="form-button rounded shadow" onClick={this.handleSubmit.bind(this)}>Set</button>
            </div>
        )
    }
}

export default SetForm;