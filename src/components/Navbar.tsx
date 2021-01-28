import React from 'react';
import '../css/Navbar.css'
import '../css/Shared.css'

type Props = {
    onSelection?: (pageName: string) => void
}

type State = {
    selectedIndex: number,
    selectedPage: string
}

const pages = ["Single Test", "Variable Log", "Definition Watcher", "YAML Editor"]

class Navbar extends React.Component<Props, State> {
    state: State = {
        selectedIndex: 0,
        selectedPage: pages[0]
    }

    constructor(props: Props) {
        super(props)
    }

    calculateSelection(): object {
        return {
            left: this.state.selectedIndex/(pages.length) * 100 + "%",
            width: 100/pages.length + "%"
        }
    }

    onSelection(selectedPageName: string) {
        this.setState({
            selectedIndex: pages.indexOf(selectedPageName),
            selectedPage: selectedPageName
        })
        
        if (this.props.onSelection) {this.props.onSelection(selectedPageName)}
    }
    

    render() {
        return (
            <div className="main-div shadow">
                <div className="selection" style={this.calculateSelection()}></div>
                <div className="page-list">
                    {pages.map(pageName => 
                        <p className={"grid-text " + (this.state.selectedPage === pageName ? "white-text" : "black-text")} onClick={this.onSelection.bind(this, pageName)}>{pageName}</p>
                    )}
                </div>
            </div>
        )
    }
}

export default Navbar;