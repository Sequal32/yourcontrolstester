import React from 'react';

import DefinitionsHandler from './Definitions/DefinitionsHandler'
import {Definition} from './Definitions/YamlParser'
import Navbar from './Navbar'
import SetForm from './Form/SetForm'
import WatcherHandler, { InputVars } from './Watcher/WatcherHandler'
import WatchForm from './Form/WatchForm'

import '../css/MainContainer.css'
import '../css/Shared.css'

type State = {
    sideBarSelectedWatcher: boolean,
    watchingVars: InputVars,
    definitionSelected?: Definition
}

class MainContainer extends React.Component<{}, State> {
    state = {
        sideBarSelectedWatcher: false,
        watchingVars: [],
        definitionSelected: undefined
    }

    onWatchVar(friendlyName: string, calculator: string) {
        this.setState(prevState => ({
            watchingVars: [...prevState.watchingVars, {calculator, friendlyName}],
            sideBarSelectedWatcher: true
        }))
    }

    onResetVars() {
        this.setState({
            watchingVars: []
        })
    }

    definitionSelected(definition: Definition) {
        this.setState({
            definitionSelected: definition
        })
    }

    watchAll(definitions: Array<Definition>) {
        const watchingVars: InputVars = definitions
            .map(({var_name, var_units, get}) => {
                let calculator = ""

                if (var_name) {
                    const name = !var_name.match(/\w:/) ? "A:" + var_name : var_name
                    calculator = `(${name}, ${var_units ?? ""})`
                } else if (get) {
                    calculator = get
                }
                
                return {
                    calculator,
                    friendlyName: var_name ?? get ?? ""
                }
            })

        this.setState({
            watchingVars,
            sideBarSelectedWatcher: true
        })
    }

    render() {
        const {sideBarSelectedWatcher, definitionSelected} = this.state

        return (
            <div>
                <div className="left">
                    <h2>YourControls Definitions Tester</h2>
                    <div className="navbar"><Navbar/></div>
                    <h2>Watch Variable</h2>
                    <WatchForm definitionOverride={definitionSelected} onSubmit={this.onWatchVar.bind(this)}/>
                    <div className="horizontal-divider"/>
                    <h2>Set Value</h2>
                    <SetForm definitionOverride={definitionSelected}/>
                </div>
                <div className="vertical-divider"/>
                <div className="right">
                    <h2>
                        {sideBarSelectedWatcher ? "Watcher" : "Definitions"}

                        <button className="form-button rounded shadow page-change-button" onClick={() => this.setState({sideBarSelectedWatcher: !sideBarSelectedWatcher})}>
                            {sideBarSelectedWatcher ? "Definitions" : "Watcher"}
                        </button>

                    </h2>

                    <div hidden={this.state.sideBarSelectedWatcher}>
                        <DefinitionsHandler definitionSelected={this.definitionSelected.bind(this)} watchAllRequested={this.watchAll.bind(this)}/>
                    </div>
                    <div hidden={!this.state.sideBarSelectedWatcher}>
                        <WatcherHandler input={this.state.watchingVars} onReset={this.onResetVars.bind(this)}/>   
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default MainContainer;