import React from 'react';
import FormField from './FormField'
import '../../css/Shared.css'
import { GenericVarForm, GenericVarFormState, Props } from './GenericVarForm';

class WatchForm extends GenericVarForm<GenericVarFormState> {
    componentDidUpdate(prevProps: Props) {
        // Changed from last update 
        const newDefinition = this.props.definitionOverride

        if (prevProps.definitionOverride != newDefinition && newDefinition != undefined) {
            this.setCalculator({
                name: newDefinition.var_name,
                units: newDefinition.var_units
            })
            
        }
    }

    render() {
        return (
            <div className="form">
                <FormField id="single" type="text" label="Variable Name" overrideValue={this.state.name ?? ""} onChange={this.nameChange.bind(this)}/>
                <FormField id="units" type="text" label="Variable Units" overrideValue={this.state.units ?? ""} onChange={this.unitsChange.bind(this)} disabled={this.isKey() || this.isLocal()}/>
                <FormField id="calculator" type="text" label="Calculator Code" widthPercent={100} overrideValue={this.state.calculator} onChange={this.calculatorChange.bind(this)}/>
                <button className="form-button rounded shadow" onClick={this.onSubmit.bind(this)}>Watch</button>
            </div>
        )
    }
}

export default WatchForm;