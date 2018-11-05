import React, {Component} from 'react';
import './App.css';
import StatusBar from "./components/status-bar/StatusBar";

//import {ipcRenderer} from "electron";
const electron = window.require("electron");
const ipc= electron.ipcRenderer;

class App extends Component {

    constructor(props) {
        super(props);
                ipc.on('device-activated', (event, {device}) => {
                    console.log(`* Device '${device}' activated`);

                    // devices.map((device, index) => {
                    //     console.log(`* Device #${index + 1}: ${device}`);
                    // });

                    let dx = this.state.dx;
                    dx[device] = {device};

                    this.setState({
                        //devices: devices,
                        dx: dx
                    });

                    // // if this is the only device (or the first)
                    // if (devices.length === 1) {
                    //     this.setState({
                    //         device: device
                    //     });
                    // }
                });
              ipc.on('device-deactivated', (event, {device}) => {
                    console.log(`* Device '${device.name}' deactivated`);

                    let dx = this.state.dx;
                    delete dx[device];

                    this.setState({
                        //devices: devices,
                        dx: dx
                    });
                });
                ipc.on('card-inserted', (event, {device, card}) => {
                    console.log(`* Card '${card}' inserted into '${device}'`);

                    let dx = this.state.dx;
                    dx[device] = {device, card};
                    this.setState({
                        card,
                        dx: dx
                    });

                    if (device === this.state.device) {
                        let log = this.state.log;
                        log.push({
                            type: 'card-inserted',
                            card,
                            device: device
                        });
                        this.setState({
                            log: log
                        });
                    }
                });
                ipc.on('card-removed', (event, {device}) => {
                    console.log(`* Card removed from '${device}' `);

                    let dx = this.state.dx;
                    dx[device] = {device, card: null};

                    this.setState({
                        card: null,
                        current: null,
                        applications: [],
                        dx: dx
                    });
                });

                ipc.on('error', (event, message) => {
                    console.log(event, message);
                });

                this.state = {
                    dx: {},
                    device: null,
                    devices: [],
                    card: null,
                    log: [],
                    current: null,
                    applications: []
                };
    }

    render() {
        return (
            <div className="App">
                <div className="Contents">
                    contents
                </div>
                <StatusBar/>
            </div>
        );
    }
}

export default App;
