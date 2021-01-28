import React from 'react';
import '../../css/Definitions.css'
import '../../css/Shared.css'

import FolderIcon from "../../assets/search.svg"

class Search extends React.Component {
    render() {
        return (
            <div className="browse-div shadow rounded">
                <input className="browse-text" type="text" placeholder="Search..."></input>
                <div className="right-justified-rectangle rounded">
                    <img className="search-image image-inside-div" src={FolderIcon}/>
                </div>
            </div>
        )
    }
}

export default Search;