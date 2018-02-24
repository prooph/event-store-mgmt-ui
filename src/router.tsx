import * as React from 'react'

export const withRouteOnEnter = callback => BaseComponent => {
    const routeOnEnterCallback = (props) => {
        if (callback && typeof callback === 'function') {
            callback(props)
        }
    }

    class routeOnEnterComponent extends React.Component {
        componentWillMount() {
            routeOnEnterCallback(this.props)
        }

        // componentWillReceiveProps(nextProps) {
        //     // not 100% sure about using `location.key` to distinguish between routes
        //     if (nextProps.location.key !== this.props.location.key) {
        //         routeOnEnterCallback(nextProps)
        //     }
        // }

        render() {
            return <BaseComponent {...this.props} />
        }
    }

    return routeOnEnterComponent
}
