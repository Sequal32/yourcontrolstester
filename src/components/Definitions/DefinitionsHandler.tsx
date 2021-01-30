import { Component, Fragment } from 'react';
import Fuse from 'fuse.js'

import DefinitionSearch from "./DefinitionSearch"
import DefinitionBrowse from "./DefinitionBrowse"
import DefinitionCard from "./DefinitionCard"
import YamlParser, { Category, ResultDefinition } from "./YamlParser"

import "../../css/Definitions.css"

type State = {
    definitions: Array<ResultDefinition>
}

const SEARCH_STRING_THRESHOLD = 0.2
export default class DefinitionsHandler extends Component<{}, State> {
    state: State = {
        definitions: []
    }

    search: Fuse<ResultDefinition> = new Fuse([], {threshold: SEARCH_STRING_THRESHOLD, keys: ["name"]})
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
                <DefinitionSearch onSearch={this.onSearch.bind(this)}/>

                <div className="vertical-list">
                    {
                        this.state.definitions.map(definition => {
                            let circles = [];

                            if (definition.unreliable) {circles.push("unreliable")}
                            if (definition.interpolate) {circles.push("interpolate")}
                            if (definition.category == Category.Master) {circles.push("master")}
                            if (definition.category == Category.Shared) {circles.push("shared")}
                            if (definition.category == Category.Init) {circles.push("init")}

                            return <DefinitionCard 
                                bigText={definition.name} 
                                smallText={definition.definitionType}
                                circles={circles}
                            />
                        })
                    }
                    
                </div>
            </Fragment>
        )
    }
}