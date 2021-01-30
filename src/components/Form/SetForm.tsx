import React from 'react';
import FormField from './FormField'
import '../../css/Shared.css'
import {GenericVarForm, GenericVarFormState, Props} from './GenericVarForm';
import {invoke} from 'tauri/api/tauri';

class SetFormState extends GenericVarFormState {
    param: string | null = null;
    value: string | null = null;
}

class SetForm extends GenericVarForm<SetFormState> {
    state: SetFormState = new SetFormState()

    paramChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({param: e.target.value})
    }

    valueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({value: e.target.value})
    }

    setCalculator(newStateChange: {name?: string, units?: string, param?: string, value?: string}) {
        let code = ""

        const name = newStateChange.name ?? this.state.name
        const units = newStateChange.units ?? this.state.units
        const param = newStateChange.param ?? this.state.param
        const value = newStateChange.value ?? this.state.value

        const nameString = name ?? ""
        const unitsString = units ?? ""
        const paramString = param ? param + " " : ""
        const valueString = value ? value + " " : ""

        if (this.isKey(name) || this.isLocal(name)) {

            code = `${paramString}${valueString}(>${nameString})`

        } else {

            // Default to A:
            const prefixedName = !nameString.match(/\w:/) ? "A:" + nameString : nameString

            code = `${paramString}${valueString}(>${prefixedName}, ${unitsString})`

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

    componentDidUpdate(prevProps: Props) {
        // Changed from last update 
        const newDefinition = this.props.definitionOverride

        if (prevProps.definitionOverride != newDefinition && newDefinition != undefined) {
            if (newDefinition.event_name) {

                this.setCalculator({
                    name: "K:" + newDefinition.event_name,
                    param: newDefinition.event_param,
                })

            } else {

                this.setCalculator({
                    name: newDefinition.var_name,
                    units: newDefinition.var_units,
                })

            }
            
        }
    }
    
    render() {
        return (
            <div className="form">
                <FormField id="single" type="text" label="Name" overrideValue={this.state.name ?? ""} onChange={this.nameChange.bind(this)}/>
                <FormField id="units" type="text" label="Units" overrideValue={this.state.units ?? ""} onChange={this.unitsChange.bind(this)} disabled={this.isKey() || this.isLocal()}/>
                <FormField id="param" type="text" label="Param" overrideValue={this.state.param ?? ""} onChange={this.paramChange.bind(this)} disabled={this.isAircraft()}/>
                <FormField id="value" type="text" label="Value" overrideValue={this.state.value ?? ""} onChange={this.valueChange.bind(this)}/>
                <FormField id="calculator" type="text" label="Calculator Code" widthPercent={100} overrideValue={this.state.calculator} onChange={this.calculatorChange.bind(this)}/>
                <button className="form-button rounded shadow" onClick={this.handleSubmit.bind(this)}>Set</button>
            </div>
        )
    }
}

export default SetForm;