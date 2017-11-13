export const conf: any = {
    container: null,
    layout: {name: 'preset'},
    style: [
        {
            selector: 'node',
            style: {
                'content': 'data(name)'
            }
        },

        {
            selector: 'edge',
            style: {
                'target-arrow-shape': 'triangle'
            }
        },
        {
            selector: '.message.command',
            style: {
                "background-color": "#247bdd"
            }
        },
        {
            selector: '.message.event',
            style: {
                "background-color": "#ff9138"
            }
        },
        {
            selector: '.parent',
            style: {
                "background-color": "#e9f2f7"
            }
        },
        {
            selector: '.event.recorder',
            style: {
                "background-color": "#f7eb44"
            }
        },
        {
            selector: '.event.factory',
            style: {
                "background-color": "#f7eb44"
            }
        },
        {
            selector: '.command.handler',
            style: {
                "background-color": "#0e1d3a"
            }
        },
        {
            selector: '.event.handler',
            style: {
                "background-color": "#0e1d3a"
            }
        },
        {
            selector: '.command.producer',
            style: {
                "background-color": "#d6b6f9"
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
