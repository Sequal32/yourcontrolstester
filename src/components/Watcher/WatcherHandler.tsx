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
    values: Array<VarData>,
}

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
    lastReceivedValues: Array<VarData> = []

    onDeleteCard(varName: string) {
        // TODO: change when gauge is rewritten
        this.ignoredVars.add(varName)
        this.filterAndSetData()
    }

    filterAndSetData() {
        let filteredData = this.lastReceivedValues.filter(({var_name: varName}) => !this.ignoredVars.has(varName)    )

        if (this.currentSearchString) {
            const search = new Fuse(filteredData, {keys: ["var_name"], includeScore: true})

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

            this.lastReceivedValues = data.payload
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
                        this.state.values.map(({var_name: varName, data}) => 
                            <WatcherCard 
                                bigText={varName} 
                                smallText={data.floating} 
                                onDelete={this.onDeleteCard.bind(this, varName)}
                            />
                        )
                    }
                </div>

            </Fragment>
        )
    }
}