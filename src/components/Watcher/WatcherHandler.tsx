import { Component, Fragment } from 'react';

import DefinitionSearch from "../Definitions/DefinitionSearch"
import WatcherCard from "./WatcherCard"
import "../../css/Definitions.css"
import "../../css/Shared.css"
import "../../css/Watcher.css"

import {promisified} from 'tauri/api/tauri'
import {Event, listen} from 'tauri/api/event'

type Props = {
    input: Array<{calculator: string, friendlyName: string}>
}

type State = {
    values: Array<VarData>,
}

type VarData = {
    id: number,
    value: number
}

export default class WatcherHandler extends Component<Props, State> {
    state: State = {
        values: [],
    }

    mappedCalculators = new Set<string>();
    ignoredIds = new Set<number>();

    idMap: {[id: number]: string} = {};
    idCounter = 0;

    onDeleteCard(cardId: number) {
        // TODO: change when gauge is rewritten
        this.ignoredIds.add(cardId)
    }

    componentDidMount() {
        listen("varUpdate", (data: Event<[VarData]>) => {
            
            data.payload.filter(({id}) => !this.ignoredIds.has(id))

            this.setState({values: data.payload})

        })
    }

    componentDidUpdate(props: Props, state: State) {
        props.input.forEach((data) => {

            if (this.mappedCalculators.has(data.calculator)) {return}
            this.mappedCalculators.add(data.calculator)

            promisified<number>({

                "cmd": "watchVar",
                "calculator": data.friendlyName,
                "id": this.idCounter++

            }).then((mappedId) => {

                this.idMap[mappedId] = data.friendlyName

            })
        })
    }

    render() {
        return (
            <Fragment>

                <DefinitionSearch/>

                <div className="vertical-list">
                    {this.state.values.map(({value, id}) => 
                        <WatcherCard bigText={this.idMap[id]} smallText={value} onDelete={this.onDeleteCard.bind(this, id)}/>
                    )}
                </div>

            </Fragment>
        )
    }
}