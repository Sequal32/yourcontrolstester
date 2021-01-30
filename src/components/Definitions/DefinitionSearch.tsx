import '../../css/Definitions.css'
import '../../css/Shared.css'

import FolderIcon from "../../assets/search.svg"

type Props = {
    onSearch: (searchText: string | undefined) => void
}

export default ({onSearch}: Props): JSX.Element => {
    return (
        <div className="browse-div shadow rounded">
            <input className="browse-text" type="text" placeholder="Search..." onChange={
                (e) => {
                    const search = e.target.value
                    onSearch(search == "" ? undefined : search)
                }}
            />
            <div className="right-justified-rectangle rounded">
                <img className="search-image image-inside-div" src={FolderIcon}/>
            </div>
        </div>
    )
}