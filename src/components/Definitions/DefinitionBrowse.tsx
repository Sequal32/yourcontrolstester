import React from 'react';
import '../../css/Definitions.css'
import '../../css/Shared.css'

import FolderIcon from "../../assets/folder.svg"

type Props = {
    
}

type State = {
    selectedName: string
}

class DefinitionBrowse extends React.Component<Props, State> {
    state: State = {
        selectedName: ""
    }

    render() {
        return (
            <div className="browse-div shadow rounded">
                <span className="browse-text">{this.state.selectedName}</span>
                <div className="right-justified-rectangle rounded browse-bg pointer browse-hover">
                    <img className="browse-image image-inside-div" src={FolderIcon}/>
                </div>
            </div>
        )
    }
}

export default DefinitionBrowse;