import { Component, Fragment } from 'react';
import Fuse from 'fuse.js'

import DefinitionSearch from "./DefinitionSearch"
import DefinitionBrowse from "./DefinitionBrowse"
import DefinitionCard from "./DefinitionCard"
import YamlParser, { Category, Definition, ResultDefinition } from "./YamlParser"

import "../../css/Definitions.css"

type State = {
    definitions: Array<ResultDefinition>
}

type Props = {
    definitionSelected: (definition: Definition) => void,
    watchAllRequested: (definition: Array<Definition>) => void
}

const SEARCH_STRING_THRESHOLD = 0.2
export default class DefinitionsHandler extends Component<Props, State> {
    state: State = {
        definitions: []
    }

    search: Fuse<ResultDefinition> = new Fuse([], {threshold: SEARCH_STRING_THRESHOLD, keys: ["definition.var_name"]})
    originalDefinitions: Array<ResultDefinition> = []

    onBrowseFile(dir: string) {
        let parser = new YamlParser(dir)
        parser.parse().then(definitions => {
            this.search.setCollection(definitions)
            this.originalDefinitions = definitions
            this.setState({definitions})
        })
        
    }

    onSearch(searchString: string | undefined) {
        if (searchString) {
            const result = this.search.search(searchString)
                .map(value => value.item)

            this.setState({definitions: result})
        } else {
            this.setState({definitions: this.originalDefinitions})
        }
    }

    render() {
        return (
            <Fragment>
                <DefinitionBrowse onBrowse={this.onBrowseFile.bind(this)}/>
                <button className="definitions-watch-button form-button rounded shadow" onClick={() => this.props.watchAllRequested(this.originalDefinitions.map(def => def.definition))}>Watch All</button>
                <DefinitionSearch onSearch={this.onSearch.bind(this)}/>

                <div className="vertical-list">
                    {
                        this.state.definitions.map(entry => {
                            let circles = [];

                            const definition = entry.definition

                            if (definition.unreliable) {circles.push("unreliable")}
                            if (definition.interpolate != undefined) {circles.push("interpolate")}
                            if (entry.category == Category.Master) {circles.push("master")}
                            if (entry.category == Category.Shared) {circles.push("shared")}
                            if (entry.category == Category.Init) {circles.push("init")}

                            return <DefinitionCard 
                                bigText={definition.var_name ?? definition.get ?? definition.event_name ?? ""} 
                                smallText={definition.type}
                                circles={circles}
                                onClick={() => this.props.definitionSelected(definition)}
                            />
                        })
                    }
                    
                </div>
            </Fragment>
        )
    }
}