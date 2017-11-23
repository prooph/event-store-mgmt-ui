import * as React from 'react';
import DropzoneComponent from 'react-dropzone';

export interface DropzoneProps {
    onDroppedFile: (file: File) => void,
    onNotSupportedFileTypeDropped: (file: File) => void
}

interface DropzoneState {
    accept: string,
    dropzoneActive: boolean
}

export class Dropzone extends React.Component<DropzoneProps, DropzoneState> {
    constructor(props: DropzoneProps) {
        super(props)
        this.state = {
            accept: 'application/json',
            dropzoneActive: false
        }
    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop(files: File[], notSupportedFiles: File[]) {
        this.setState({
            dropzoneActive: false
        });
        const cb = this.props.onDroppedFile;
        const notSupportedCb = this.props.onNotSupportedFileTypeDropped;

        files.forEach(file => cb(file));
        notSupportedFiles.forEach(file => notSupportedCb(file));
    }

    render() {
        const { accept, dropzoneActive } = this.state;
        const overlayStyle = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            padding: '2.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff'
        };
        return <DropzoneComponent
                disableClick
                style={{height: "100%", width: "100%", display: "block"}}
                accept={accept}
                onDrop={this.onDrop.bind(this)}
                onDragEnter={this.onDragEnter.bind(this)}
                onDragLeave={this.onDragLeave.bind(this)}
            >
                { dropzoneActive && <div style={overlayStyle as any}>Drop files...</div> }
                {this.props.children}
            </DropzoneComponent>
    }
}