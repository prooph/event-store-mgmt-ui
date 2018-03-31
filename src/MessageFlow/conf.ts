import configuredAxios from "../api/ConfiguredAxios";
const fasSvgUrl = require('../theme/font-awesome/fa-solid.svg');
const farSvgUrl = require('../theme/font-awesome/fa-regular.svg');
const fabSvgUrl = require('../theme/font-awesome/fa-brands.svg');

let fasSvg;
let farSvg;
let fabSvg;

export const loadFontAwesomeSvg = (): Promise<void[]> => {
    const fasPromise = configuredAxios.request({url: fasSvgUrl}).then(response => {
        const xmlResponse = response as any;
        fasSvg = xmlResponse.request.responseXML;
    })

    const farPromise = configuredAxios.request({url: farSvgUrl}).then(response => {
        const xmlResponse = response as any;
        farSvg = xmlResponse.request.responseXML;
    })

    const fabPromise = configuredAxios.request({url: fabSvgUrl}).then(response => {
        const xmlResponse = response as any;
        fabSvg = xmlResponse.request.responseXML;
    })

    return Promise.all([fasPromise, farPromise, fabPromise]);
}


const faIconPath = (icon: Icon): string => {
    if(icon.isLink()) {
        throw Error("Cannot determine font awesome path for link icon. Got " + icon.name);
    }

    if(icon.type === 'default') {
        //default icon: dot-circle
        return 'M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm80 248c0 44.112-35.888 80-80 80s-80-35.888-80-80 35.888-80 80-80 80 35.888 80 80z';
    }

    const iconName = icon.name.replace('fa-', '');

    try {
        switch (icon.type) {
            case 'fas':
                return fasSvg.querySelector(`#${iconName} path`).getAttribute('d');
            case 'far':
                return farSvg.querySelector(`#${iconName} path`).getAttribute('d');
            case 'fab':
                return fabSvg.querySelector(`#${iconName} path`).getAttribute('d');
        }
    } catch (e) {
        throw Error(`FontAwesome ${icon.type} icon "${icon.name}" not available. Did you pick a pro item? Only free icons are supported.`)
    }
}

interface Icon {
    type: string,
    name: string,
    isLink: () => boolean,
}

const iconFromString = (icon: string): Icon => {
    if(icon === '__default__') {
        return {
            type: "default",
            name: "__default__",
            isLink: () => false,
        }
    }

    const [type, name] = icon.split(" ");

    if(type !== 'fas' && type !== 'far' && type !== 'fab' && type !== 'link') {
        throw Error(`Unsupported icon type. Should be one of: fas, far, fab, link. Got ${type}`);
    }

    if(!name) {
        throw Error(`Missing icon name. Got ${icon}`);
    }

    return {
        type,
        name,
        isLink: () => type === 'link',
    }
}


function renderNodeBg (ele) {
    let iStr = ele.data('icon');

    if(!iStr || !fasSvg) {
        iStr = '__default__';
    }

    const icon = iconFromString(iStr);

    let color = ele.data('color') || '#343434';

    if(ele.hasClass('inactive')) {
        color = '#C2C2C2';
    }

    if(icon.isLink()) {
        return {url: icon.name}
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

function renderParentBgColor(ele) {
    const color = ele.data('color') || '#E9F2F7';

    return {color}
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
                'font-size': '42px',
                'text-background-color': ele => renderNodeBgColor(ele).color,
                'text-background-opacity': 1
            },
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'haystack',
                'mid-target-arrow-shape': 'triangle',
                'arrow-scale': 2
            }
        },
        {
            selector: '.parent',
            style: {
                'background-color': ele => renderParentBgColor(ele).color,
                'text-valign': 'top',
                'font-size': '52px',
                'font-weight': 'bold'
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
