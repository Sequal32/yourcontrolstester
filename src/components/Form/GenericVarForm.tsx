import React from "react";

export class GenericVarFormState {
    name: string = "";
    units: string = "";
    calculator: string = "";
    calculatorManuallyChanged: boolean = false;
}

export class GenericVarForm<T extends GenericVarFormState> extends React.Component<{}, T> {
    state = new GenericVarFormState() as T;

    isKey(): boolean {
        return this.state.name.startsWith("K:") || this.state.name.startsWith("H:")
    }

    isLocal(): boolean {
        return this.state.name.startsWith("L:")
    }

    isAircraft(): boolean {
        return this.state.name.startsWith("A:")
    }

    nameChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Assume it's an aircraft var if not explicity defined
        const value = e.target.value;
        const name = !value.match(/\w:/) ? "A:" + value : value

        this.setState({
            name: name,
        })
    }

    unitsChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            units: e.target.value,
        })
    }

    compileCalculatorCode(): string {
        let code = ""

        if (this.isKey() || this.isLocal()) {

            code = `(${this.state.name})`

        } else {

            code = `(${this.state.name}, ${this.state.units})`

        }

        return code
    }

    calculatorChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            calculator: e.target.value,
            calculatorManuallyChanged: true
        })
    }

    calculatorOnRender() {
        if (!this.state.calculatorManuallyChanged) {
            this.state.calculator = this.compileCalculatorCode()
        } else {
            this.state.calculatorManuallyChanged = false
        }
    }

    render() {
        this.calculatorOnRender();
        return <div/>;
    }
}