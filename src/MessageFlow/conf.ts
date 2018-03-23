import configuredAxios from "../api/ConfiguredAxios";
import {AxiosPromise} from "axios";
const faSvgUrl = require('../theme/font-awesome/fa-solid.svg');

let faSvg;

export const loadFontAwesomeSvg = (): Promise<void> => {
    return configuredAxios.request({url: faSvgUrl}).then(response => {
        const xmlResponse = response as any;
        faSvg = xmlResponse.request.responseXML;
    })
}


const faIconPath = (icon: string): string => {
    if(icon === '__default__') {
        //default icon: dot-circle
        return 'M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z';
    }

    icon = icon.replace('fa-', '');

    try {
       return faSvg.querySelector(`#${icon} path`).getAttribute('d');
    } catch (e) {
        throw Error(`FontAwesome icon "${icon}" not available`)
    }
}

function renderNodeBg (ele) {
    let icon = ele.data('icon');

    if(!icon || !faSvg) {
        icon = '__default__';
    }

    let color = ele.data('color') || '#343434';

    if(ele.hasClass('inactive')) {
        color = '#C2C2C2';
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg>
<svg xmlns="http://www.w3.org/2000/svg" width="75" height="50" viewBox="0 0 512 512">
    <path fill="${color}" d="${faIconPath(icon)}"></path>
</svg>`;


    return {
        url: 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
    }
}

function renderNodeBgColor(ele) {
    const color = ele.data("parent")? ele.data("parentColor") || '#E9F2F7' : '#FFFFFF';

    return {color};
}


export const conf: any = {
    container: null,
    layout: {name: 'grid'},
    style: [
        {
            selector: 'node',
            style: {
                'shape': 'rectangle',
                'content': 'data(name)',
                'background-image': ele => renderNodeBg(ele).url,
                'background-color': ele => renderNodeBgColor(ele).color,
                'width': 75,
                'height': 75,
                'text-valign': 'bottom',
            },
        },
        {
            selector: 'edge',
            style: {
                'target-arrow-shape': 'triangle'
            }
        },
        {
            selector: '.parent',
            style: {
                "background-color": "#e9f2f7",
                "text-valign": "top",
            }
        },
        {
            selector: 'node:selected',
            style: {
                "overlay-color": "#90ee8f",
                "overlay-opacity": "0.5",
                "overlay-padding": "5"
            }
        }
    ],
};
