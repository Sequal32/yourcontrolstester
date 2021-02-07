import React, { CSSProperties } from 'react';

import '../../css/Definitions.css'
import '../../css/Watcher.css'

import TrashIcon from "../../assets/trash.svg"

type Props = {
    bigText: string,
    smallText: number,
    smallTextStyle?: CSSProperties,

    onDelete?: () => void
}

type State = {

}

class DefinitionCard extends React.Component<Props, State> {
    render() {
        return (
            <div className="rounded definition-card shadow">
                <div className="watcher-text-div">
                    <p className="watcher-big-text">{this.props.bigText}</p>
                    <p className="watcher-small-text" style={this.props.smallTextStyle}>{this.props.smallText}</p>
                </div>
                <div className="right-justified-rectangle rounded">
                    <img className="trash-image image-inside-div-bottom pointer" src={TrashIcon} onClick={this.props.onDelete}/>
                </div>
            </div>
        )
    }
}

export default DefinitionCard;