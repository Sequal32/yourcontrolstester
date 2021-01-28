import React, { CSSProperties } from 'react';
import '../../css/FormField.css'
import '../../css/Shared.css'

type Props = {
    id: string,
    label: string,
    type: string,
    disabled?: boolean,
    labelStyle?: CSSProperties,
    widthPercent?: number,
    overrideValue?: string,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type State = {}

class FormField extends React.Component<Props, State> {
    render() {
        return (
            <div style={{width: this.props.widthPercent ? this.props.widthPercent + "%" : "49%"}} className="field">
                <label htmlFor={this.props.id} className="field-label" style={this.props.labelStyle}>{this.props.label}</label>
                <input disabled={this.props.disabled} type={this.props.type} id={this.props.id} className="field-input shadow" onChange={this.props.onChange} value={this.props.overrideValue}/>
            </div>
        )
    }
}

export default FormField;