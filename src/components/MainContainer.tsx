import React from 'react';

import DefinitionsHandler from './Definitions/DefinitionsHandler'
import Navbar from './Navbar'
import SetForm from './Form/SetForm'
import WatcherHandler, { InputVars } from './Watcher/WatcherHandler'
import WatchForm from './Form/WatchForm'

import '../css/MainContainer.css'
import '../css/Shared.css'

type State = {
    sideBarSelectedWatcher: boolean,
    watchingVars: InputVars
}

class MainContainer extends React.Component<{}, State> {
    state = {
        sideBarSelectedWatcher: false,
        watchingVars: []
    }

    onWatchVar(friendlyName: string, calculator: string) {
        this.setState(prevState => ({
            watchingVars: [...prevState.watchingVars, {calculator, friendlyName}]
        }))
    }

    render() {
        const {sideBarSelectedWatcher} = this.state

        return (
            <div>
                <div className="left">
                    <h2>YourControls Definitions Tester</h2>
                    <div className="navbar"><Navbar/></div>
                    <h2>Watch Variable</h2>
                    <WatchForm onSubmit={this.onWatchVar.bind(this)}/>
                    <div className="horizontal-divider"/>
                    <h2>Set Value</h2>
                    <SetForm/>
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
                        <DefinitionsHandler/>
                    </div>
                    <div hidden={!this.state.sideBarSelectedWatcher}>
                        <WatcherHandler input={this.state.watchingVars}/>   
                    </div>

                    
                    
                </div>
            </div>
        )
    }
}

export default MainContainer;