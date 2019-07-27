import React from 'react';
import { ROS_SOCKET_STATUSES } from '../utils';

export const CONNECTION_DOT_CLASSES = {
  [ROS_SOCKET_STATUSES.INITIAL]: 'initial',
  [ROS_SOCKET_STATUSES.CONNECTING]: 'connecting',
  [ROS_SOCKET_STATUSES.CONNECTED]: 'connected',
  [ROS_SOCKET_STATUSES.CONNECTION_ERROR]: 'error',
};

class ConnectionDot extends React.PureComponent {
  render() {
    const { status } = this.props;
    return (
      <span
        id="rosStatusIndicator"
        className={CONNECTION_DOT_CLASSES[status]}
      />
    );
  }
}

export default ConnectionDot;
