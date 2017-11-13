import * as React from 'react';
import * as cytoscape from 'cytoscape';
import {conf} from '../conf';
import {gridConf} from "../grid-conf"


let cyStyle = {
    height: '100%',
    width: '100%',
    display: 'block'
};

export interface CytoscapeProps {
    elements: cytoscape.CollectionElements
}

class Cytoscape extends React.Component<CytoscapeProps, undefined>{
    private cy: cytoscape.Core;
    private cyelement: HTMLDivElement;

    componentDidMount(){
        conf.container = this.cyelement;
        let cy = cytoscape(conf);

        cy["gridGuide"](gridConf);

        this.cy = cy;
        cy.add(this.props.elements);
    }

    shouldComponentUpdate(){
        return false;
    }

    componentWillReceiveProps(nextProps: CytoscapeProps){
        this.cy.add(nextProps.elements);
    }

    componentWillUnmount(){
        this.cy.destroy();
    }

    getCy(){
        return this.cy;
    }

    render(){
        return <div style={cyStyle} ref={(div) => { this.cyelement = div; }} />
    }
}

export default Cytoscape;