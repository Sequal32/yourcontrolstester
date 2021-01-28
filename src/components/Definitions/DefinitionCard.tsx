import React from 'react';

import '../../css/Definitions.css'

type Props = {
    bigText: string,
    smallText: string,
    circles?: Array<string>
}

type State = {

}

const circleColors: {[name: string]: string} = {
    interpolate: "purple",
    unreliable: "red",
    master: "cyan",
    shared: "green"
}

class DefinitionCard extends React.Component<Props, State> {
    render() {
        return (
            <div className="rounded definition-card shadow">
                <div className="definition-text-div">
                    <h2 className="definition-big-text">{this.props.bigText}</h2>
                    <p className="definition-small-text">{this.props.smallText}</p>
                </div>
                <div className="definition-circles">
                    {this.props.circles != null ? this.props.circles.map(name => <div className="circle" style={{borderColor: circleColors[name]}}/>) : null}
                </div>
            </div>
        )
    }
}

export default DefinitionCard;