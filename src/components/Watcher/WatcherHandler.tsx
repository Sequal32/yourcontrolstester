import { Component, Fragment } from 'react';

import DefinitionSearch from "../Definitions/DefinitionSearch"
import WatcherCard from "./WatcherCard"
import "../../css/Definitions.css"
import "../../css/Shared.css"
import "../../css/Watcher.css"

import {invoke} from 'tauri/api/tauri'
import {Event, listen} from 'tauri/api/event'
import Fuse from 'fuse.js'

export type InputVars = Array<{calculator: string, friendlyName: string}>;

type Props = {
    input: InputVars,
    hidden?: boolean,
    onReset?: () => void
}

type State = {
    values: ValueArray,
}

type ValueArray = Array<{name: string, value: number}>

type VarData = {
    var_name: string,
    data: {
        integer: number,
        floating: number
    }
}

const SEARCH_STRING_THRESHOLD = 0.5

export default class WatcherHandler extends Component<Props, State> {
    state: State = {
        values: [],
    }

    mappedCalculators = new Set<string>();
    ignoredVars = new Set<string>();

    currentSearchString: string | undefined = undefined
    currentValues: Map<string, {value: number, updated: number}> = new Map()

    onDeleteCard(varName: string) {
        // TODO: change when gauge is rewritten
        this.ignoredVars.add(varName)
        this.filterAndSetData()
    }

    filterAndSetData() {
        let filteredData: ValueArray = []
        
        this.currentValues.forEach(({value}, varName) => {
            if (this.ignoredVars.has(varName)) {return}
            filteredData.push({name: varName, value})
        })

        if (this.currentSearchString) {
            const search = new Fuse(filteredData, {keys: ["name"], includeScore: true})

            filteredData = search.search(this.currentSearchString)
                .filter((value) => value.score! <= SEARCH_STRING_THRESHOLD)
                .map((value) => value.item)
        }

        this.setState({
            values: filteredData
        })
    }

    componentDidMount() {
        listen("update", (data: Event<Array<VarData>>) => {

            data.payload.forEach(data => {
                this.currentValues.set(data.var_name, {
                    value: data.data.floating,
                    updated: Date.now()
                })
            })

            this.filterAndSetData()

        })
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        this.props.input.forEach((data) => {
            // Ignored so bring back, but don't add 
            if (this.ignoredVars.has(data.calculator)) {
                this.ignoredVars.delete(data.calculator)
                return
            }

            if (this.mappedCalculators.has(data.calculator)) {return}
            this.mappedCalculators.add(data.calculator)

            invoke({
                cmd: "watchVar",
                data: {
                    calculator: data.calculator,
                    name: data.friendlyName
                }
            })
        })
    }

    resetVars() {
        invoke({
            cmd: "resetVars"
        })

        if (this.props.onReset) {this.props.onReset()}

        this.ignoredVars.clear()
        this.mappedCalculators.clear()

        this.setState({
            values: []
        })
    }

    onSearch(searchString: string | undefined) {
        this.currentSearchString = searchString
        this.filterAndSetData()
    }

    render() {
        return (
            <Fragment>

                <button className="form-button rounded shadow watcher-reset-button" onClick={this.resetVars.bind(this)}>Reset Vars</button>
                <DefinitionSearch onSearch={this.onSearch.bind(this)}/>

                <div className="vertical-list">
                    {
                        this.state.values.map(({name, value}) => {
                            const recentlyUpdated = Date.now()-(this.currentValues.get(name)?.updated ?? 0) <= 1.0

                            return (<WatcherCard 
                                bigText={name} 
                                smallText={value}
                                smallTextStyle={{color: recentlyUpdated ? "red" : undefined}}
                                onDelete={this.onDeleteCard.bind(this, name)}
                            />)
                        })
                    }
                </div>

            </Fragment>
        )
    }
}