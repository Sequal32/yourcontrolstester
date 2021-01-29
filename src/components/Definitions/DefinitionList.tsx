import React from 'react';
import DefinitionCard from './DefinitionCard';

import '../../css/Definitions.css'
import '../../css/Shared.css'

class DefinitionList extends React.Component {
    render() {
        return (
            <div className="vertical-list">
                <DefinitionCard bigText="A:PLANE ALTITUDE" smallText="NumSet" circles={["master", "shared", "unreliable", "interpolate"]}/>
            </div>
        )
    }
}

export default DefinitionList;