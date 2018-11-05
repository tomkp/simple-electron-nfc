import React from 'react';
import Indicator from '../indicator/Indicator';
import './status-bar.css';

export default ({dx = {}, device}) => {

    console.log(`StatusBar`, device, dx);

    const cx = dx[device] ? dx[device].card : null;

    return <div className="status-bar">
        <Indicator name="device-status" status={device?'activated':'deactivated'} title={device?'Device activated':'Device deactivated'} />
        <Indicator name="card-status" status={cx?'inserted':'removed'} title={cx?'Card inserted':'Card removed'} />
    </div>
};

