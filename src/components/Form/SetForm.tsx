import React from 'react';
import FormField from './FormField'
import '../../css/Shared.css'
import {GenericVarForm, GenericVarFormState} from './GenericVarForm';

class SetFormState extends GenericVarFormState {
    param: string = "";
    value: string = "";
}

class SetForm extends GenericVarForm<SetFormState> {
    state: SetFormState = new SetFormState()

    paramChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            param: e.target.value,
        })
    }

    valueChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            value: e.target.value,
        })
    }

    compileCalculatorCode(): string {
        let code = ""

        if (this.isKey() || this.isLocal()) {

            code = `${this.state.param} ${this.state.value} (>${this.state.name})`

        } else if (this.isAircraft()) {

            code = `${this.state.param} ${this.state.value} (>${this.state.name}, ${this.state.units})`

        } else {
            // Name not defined yet
            code = `${this.state.value} (>, ${this.state.units})`

        }

        return code
    }
    
    render() {
        super.render();
        return (
            <div className="form">
                <FormField id="single" type="text" label="Name" onChange={this.nameChange.bind(this)}/>
                <FormField id="units" type="text" label="Units" onChange={this.unitsChange.bind(this)} disabled={this.isKey() || this.isLocal()}/>
                <FormField id="param" type="text" label="Param" onChange={this.paramChange.bind(this)}/>
                <FormField id="value" type="text" label="Value" onChange={this.valueChange.bind(this)}/>
                <FormField id="calculator" type="text" label="Calculator Code" widthPercent={100} overrideValue={this.state.calculator} onChange={this.calculatorChange.bind(this)}/>
                <button className="form-button rounded shadow">Set</button>
            </div>
        )
    }
}

export default SetForm;