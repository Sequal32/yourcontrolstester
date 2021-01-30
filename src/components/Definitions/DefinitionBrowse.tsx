import React from 'react';
import '../../css/Definitions.css'
import '../../css/Shared.css'

import FolderIcon from "../../assets/folder.svg"

import {open} from "tauri/api/dialog"

type Props = {
    onBrowse: (dir: string) => void
}

type State = {
    selectedName: string
}

class DefinitionBrowse extends React.Component<Props, State> {
    state: State = {
        selectedName: ""
    }

    onBrowse() {
        open({directory: false})
            .then((dir) => {
                dir = dir as string

                this.setState({
                    selectedName: dir.split("\\").pop()!
                })
                this.props.onBrowse(dir)
            })
    }

    render() {
        return (
            <div className="browse-div shadow rounded">
                <span className="browse-text">{this.state.selectedName}</span>
                <div className="right-justified-rectangle rounded browse-bg pointer browse-hover">
                    <img className="browse-image image-inside-div" src={FolderIcon} onClick={this.onBrowse.bind(this)}/>
                </div>
            </div>
        )
    }
}

export default DefinitionBrowse;