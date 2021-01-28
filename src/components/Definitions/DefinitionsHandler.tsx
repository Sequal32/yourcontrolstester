import React from 'react';

import DefinitionSearch from "./DefinitionSearch"
import DefinitionBrowse from "./DefinitionBrowse"
import DefinitionList from "./DefinitionList"

import "../../css/Definitions.css"

class DefinitionsHandler extends React.Component {
    render() {
        return (
            <div>
                <DefinitionBrowse/>
                <DefinitionSearch/>
                <DefinitionList/>
            </div>
        )
    }
}

export default DefinitionsHandler;