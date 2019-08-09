import React from 'react';
import withGracefulUnmount from 'react-graceful-unmount';
import _ from 'lodash';
import ROSLIB from 'roslib';
import Amphion from 'amphion';

import { DEFAULT_CONFIG, ROS_SOCKET_STATUSES } from '../utils';

import { PanelWrapper, PanelContent } from '../components/styled';
import AddModal from './addModal';
import Sidebar from './sidebar';
import Viewport from './viewer';
import Info from './info';
import Tools from './tools';
import Visualization from './visualizations';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rosEndpoint: '',
      rosStatus: ROS_SOCKET_STATUSES.INITIAL,
      addModalOpen: false,
      rosTopics: [],
      rosParams: [],
      framesList: [],
      startConnectTime: undefined
    };

    this.connectRos = this.connectRos.bind(this);
    this.disconnectRos = this.disconnectRos.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.refreshRosData = this.refreshRosData.bind(this);
    this.addVisualization = this.addVisualization.bind(this);
    this.updateFramesList = this.updateFramesList.bind(this);

    this.ros = new ROSLIB.Ros();
    this.viewer = new Amphion.TfViewer(this.ros, {
      onFramesListUpdate: this.updateFramesList,
    });
  }

  static getDerivedStateFromProps({ configuration }) {
    return {
      rosEndpoint: configuration.ros.endpoint,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { rosEndpoint, startConnectTime } = this.state;
    if (prevState.rosEndpoint !== rosEndpoint) {
      this.disconnectRos();
      startConnectTime = Date.now();
      this.connectRos();
    }
  }

  componentDidMount() {
    const { rosEndpoint, startConnectTime } = this.state;
    this.ros.on('error', () => {
      // add a 20 second retry timeout
      if ((Date.now() - startConnectTime) / 1000 > 20)
      {
        this.setState({
          rosStatus: ROS_SOCKET_STATUSES.CONNECTION_ERROR,
        });
      } else {
        // wait 1 second, and try again
        setTimeout(() => {
          if (rosEndpoint && this.state.rosStatus != ROS_SOCKET_STATUSES.CONNECTED) {
            this.connectRos();
          }
        }, 1000);
      }
    });

    this.ros.on('connection', this.refreshRosData);

    this.ros.on('close', () => {
      this.setState({
        rosStatus: ROS_SOCKET_STATUSES.INITIAL,
      });
    });

    if (rosEndpoint) {
      this.connectRos();
    }
  }

  updateFramesList(framesList) {
    this.setState({
      framesList: [...framesList],
    });
  }

  refreshRosData() {
    this.ros.getTopics(rosTopics => {
      this.setState({
        rosStatus: ROS_SOCKET_STATUSES.CONNECTED,
        rosTopics: _.map(rosTopics.topics, (name, index) => ({
          name,
          messageType: rosTopics.types[index],
        })),
      });
    });
    this.ros.getParams(rosParams => {
      this.setState({ rosParams: _.map(rosParams, p => _.trimStart(p, '/')) });
    });
  }

  componentWillUnmount() {
    this.viewer.destroy();
  }

  connectRos() {
    const { rosEndpoint } = this.state;
    this.setState({
      rosStatus: ROS_SOCKET_STATUSES.CONNECTING,
    });
    this.ros.connect(rosEndpoint);
  }

  disconnectRos() {
    if (this.ros && this.ros.isConnected) {
      this.ros.close();
    }
  }

  toggleAddModal() {
    const { addModalOpen } = this.state;
    this.setState({
      addModalOpen: !addModalOpen,
    });
  }

  addVisualization(options) {
    const { addVisualization } = this.props;
    addVisualization(options);
    this.setState({
      addModalOpen: false,
    });
  }

  render() {
    const {
      addModalOpen,
      framesList,
      rosStatus,
      rosTopics,
      rosParams,
      rosEndpoint,
    } = this.state;
    const {
      configuration: {
        panels: {
          sidebar: { display: displaySidebar },
          tools: { display: displayTools },
          info: { display: displayInfo },
        },
        globalOptions,
        visualizations,
      },
      updateVizOptions,
      updateGlobalOptions,
      updateRosEndpoint,
      removeVisualization,
      toggleVisibility,
    } = this.props;
    return (
      <PanelWrapper>
        {addModalOpen && (
          <AddModal
            ros={this.ros}
            rosTopics={rosTopics}
            rosParams={rosParams}
            closeModal={this.toggleAddModal}
            addVisualization={this.addVisualization}
          />
        )}
        {displaySidebar && (
          <Sidebar
            framesList={framesList}
            globalOptions={globalOptions}
            updateGlobalOptions={updateGlobalOptions}
            rosEndpoint={rosEndpoint}
            rosStatus={rosStatus}
            visualizations={visualizations}
            viewer={this.viewer}
            rosTopics={rosTopics}
            rosInstance={this.ros}
            updateVizOptions={updateVizOptions}
            updateRosEndpoint={updateRosEndpoint}
            toggleAddModal={this.toggleAddModal}
            removeVisualization={removeVisualization}
            toggleVisibility={toggleVisibility}
          />
        )}
        <PanelContent>
          {displayTools && <Tools />}
          <Viewport viewer={this.viewer} globalOptions={globalOptions} />
          {displayInfo && <Info />}
        </PanelContent>
        {_.map(visualizations, vizItem => (
          <Visualization
            options={vizItem}
            key={vizItem.key}
            viewer={this.viewer}
            rosTopics={rosTopics}
            rosInstance={this.ros}
          />
        ))}
      </PanelWrapper>
    );
  }
}

Wrapper.defaultProps = {
  configuration: DEFAULT_CONFIG,
};

export default withGracefulUnmount(Wrapper);
