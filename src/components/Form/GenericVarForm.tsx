import React from "react";

export class GenericVarFormState {
    name: string = "";
    units: string | null = null;
    calculator: string = "";
}

type Props = {
    onSubmit?: (friendlyName: string, calculator: string) => void
}

export class GenericVarForm<T extends GenericVarFormState> extends React.Component<Props, T> {
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

        this.setCalculator({name})
    }

    unitsChange(e: React.ChangeEvent<HTMLInputElement>) {
        const units = e.target.value == "" ? undefined : e.target.value;
        this.setCalculator({units})
    }

    setCalculator(newStateChange: {name?: string, units?: string}) {
        let code = ""

        const name = newStateChange.name ?? this.state.name
        const units = newStateChange.units ?? this.state.units

        if (this.isKey() || this.isLocal()) {

            code = `(${name ?? ""})`

        } else {

            code = `(${name ?? ""}, ${units ?? ""})`

        }

        this.setState({
            calculator: code,
            name, units
        })
    }

    calculatorChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            calculator: e.target.value
        })
    }

    onSubmit() {
        if (!this.props.onSubmit) {return}

        this.props.onSubmit(
            this.state.name.replace("/\w:/", ""),
            this.state.calculator
        )
    }
}