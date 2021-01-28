import React from 'react';
import Navbar from './Navbar'
import WatchForm from './Form/WatchForm'
import SetForm from './Form/SetForm'
import DefinitionsHandler from './Definitions/DefinitionsHandler'

import '../css/MainContainer.css'

class MainContainer extends React.Component {
    render() {
        return (
            <div>
                <div className="left">
                    <h2>YourControls Definitions Tester</h2>
                    <div className="navbar"><Navbar/></div>
                    <h2>Watch Variable</h2>
                    <WatchForm/>
                    <div className="horizontal-divider"/>
                    <h2>Set Value</h2>
                    <SetForm/>
                </div>
                <div className="vertical-divider"/>
                <div className="right">
                    <h2>Definitions</h2>
                    <DefinitionsHandler/>
                </div>
            </div>
        )
    }
}

export default MainContainer;