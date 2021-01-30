import React from "react";
import { Definition } from "../Definitions/YamlParser";

export class GenericVarFormState {
    name: string = "";
    units: string | null = null;
    calculator: string = "";
}

export type Props = {
    onSubmit?: (friendlyName: string, calculator: string) => void,
    definitionOverride?: Definition
}

export class GenericVarForm<T extends GenericVarFormState> extends React.Component<Props, T> {
    state = new GenericVarFormState() as T;

    isKey(targetString?: string): boolean {
        targetString = targetString ?? this.state.name
        return targetString.startsWith("K:") || targetString.startsWith("H:")
    }

    isLocal(targetString?: string): boolean {
        targetString = targetString ?? this.state.name
        return targetString.startsWith("L:")
    }

    isAircraft(targetString?: string): boolean {
        targetString = targetString ?? this.state.name
        return targetString.startsWith("A:")
    }

    nameChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({name: e.target.value})
    }

    unitsChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setCalculator({units: e.target.value})
    }

    setCalculator(newStateChange: {name?: string, units?: string}) {
        let code = ""

        const name = newStateChange.name ?? this.state.name
        const units = newStateChange.units ?? this.state.units

        if (this.isKey(name) || this.isLocal(name)) {

            code = `(${name ?? ""})`

        } else {

            // Default to A:
            const prefixedName = !name.match(/\w:/) ? "A:" + name : name

            code = `(${prefixedName ?? ""}, ${units ?? ""})`

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