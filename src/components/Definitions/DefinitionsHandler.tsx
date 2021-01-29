import { Component, Fragment } from 'react';

import DefinitionSearch from "./DefinitionSearch"
import DefinitionBrowse from "./DefinitionBrowse"
import DefinitionList from "./DefinitionList"

import "../../css/Definitions.css"

export default class DefinitionsHandler extends Component {
    render() {
        return (
            <Fragment>
                <DefinitionBrowse/>
                <DefinitionSearch/>
                <DefinitionList/>
            </Fragment>
        )
    }
}