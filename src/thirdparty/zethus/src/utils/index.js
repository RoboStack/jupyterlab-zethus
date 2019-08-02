import {
  MESSAGE_TYPE_TF,
  MESSAGE_TYPE_POSESTAMPED,
  MESSAGE_TYPE_POINTCLOUD2,
  MESSAGE_TYPE_MARKERARRAY,
  MESSAGE_TYPE_LASERSCAN,
  MESSAGE_TYPE_OCCUPANCYGRID,
  MESSAGE_TYPE_ODOMETRY,
  MESSAGE_TYPE_ROBOT_MODEL,
  MESSAGE_TYPE_POSEARRAY,
  MESSAGE_TYPE_PATH,
  MESSAGE_TYPE_IMAGE,
  MESSAGE_TYPE_MARKER,
  MESSAGE_TYPE_TF2,
  VIZ_TYPE_IMAGE,
  VIZ_TYPE_LASERSCAN,
  VIZ_TYPE_MAP,
  VIZ_TYPE_MARKER,
  VIZ_TYPE_MARKERARRAY,
  VIZ_TYPE_ODOMETRY,
  VIZ_TYPE_PATH,
  VIZ_TYPE_POINTCLOUD,
  VIZ_TYPE_POSE,
  VIZ_TYPE_POSEARRAY,
  VIZ_TYPE_ROBOTMODEL,
  VIZ_TYPE_TF,
  DEFAULT_OPTIONS_SCENE,
} from 'amphion/src/utils/constants';
import _ from 'lodash';

export const ROS_SOCKET_STATUSES = {
  INITIAL: 'Idle. Not Connected',
  CONNECTING: 'Connecting',
  CONNECTED: 'Connected successfully',
  CONNECTION_ERROR: 'Error in connection',
};

const DOCS_ROOT_URL = 'https://github.com/rapyuta-robotics/zethus/wiki/';

export const TF_MESSAGE_TYPES = [MESSAGE_TYPE_TF, MESSAGE_TYPE_TF2];

export const getTfTopics = rosTopics =>
  _.filter(rosTopics, t => _.includes(TF_MESSAGE_TYPES, t.messageType));

export const vizOptions = [
  {
    type: VIZ_TYPE_IMAGE,
    icon: '/image/icons/icon_image.svg',
    messageTypes: [MESSAGE_TYPE_IMAGE],
    description: `Creates a container to visualize the image data represented by a sensor_msgs/Image topic.
    ![](/image/viz/viz-image.png "")`,
    docsLink: `${DOCS_ROOT_URL}Image`,
  },
  {
    type: VIZ_TYPE_LASERSCAN,
    icon: '/image/icons/icon_laser_scan.svg',
    messageTypes: [MESSAGE_TYPE_LASERSCAN],
    description: `Adds a visualization represented by a sensor_msgs/LaserScan topic to the scene.
    ![](/image/viz/viz-laserscan.png "")`,
    docsLink: `${DOCS_ROOT_URL}Laser-Scan`,
  },
  {
    type: VIZ_TYPE_MAP,
    icon: '/image/icons/icon_map.svg',
    messageTypes: [MESSAGE_TYPE_OCCUPANCYGRID],
    description: `Adds a visualization represented by a nav_msgs/OccupancyGrid topic to the scene.
    ![](/image/viz/viz-map.png "")`,
    docsLink: `${DOCS_ROOT_URL}Map`,
  },
  {
    type: VIZ_TYPE_MARKER,
    icon: '/image/icons/icon_marker.svg',
    messageTypes: [MESSAGE_TYPE_MARKER],
    description: `Adds a visualization represented by a visualization_msgs/Marker or visualization_msgs/MarkerArray topic to the scene.
    ![](/image/viz/viz-marker.png "")`,
    docsLink: `${DOCS_ROOT_URL}Marker`,
  },
  {
    type: VIZ_TYPE_MARKERARRAY,
    icon: '/image/icons/icon_marker_array.svg',
    messageTypes: [MESSAGE_TYPE_MARKERARRAY],
    description: `Adds a visualization represented by a visualization_msgs/Marker or visualization_msgs/MarkerArray topic to the scene.
    ![](/image/viz/viz-markerarray.png "")`,
    docsLink: `${DOCS_ROOT_URL}Marker-Array`,
  },
  {
    type: VIZ_TYPE_ODOMETRY,
    icon: '/image/icons/icon_odometry.svg',
    messageTypes: [MESSAGE_TYPE_ODOMETRY],
    description: `Adds a visualization represented by a nav_msgs/Odometry topic to the scene.
    ![](/image/viz/viz-odometry.png "")`,
    docsLink: `${DOCS_ROOT_URL}Odometry`,
    isDisplay: false,
  },
  {
    type: VIZ_TYPE_PATH,
    icon: '/image/icons/icon_path.svg',
    messageTypes: [MESSAGE_TYPE_PATH],
    description: `Adds a visualization represented by a nav_msgs/Path topic to the scene.
    ![](/image/viz/viz-path.png "")`,
    docsLink: `${DOCS_ROOT_URL}Path`,
  },
  {
    type: VIZ_TYPE_POINTCLOUD,
    icon: '/image/icons/icon_pointcloud_2.svg',
    messageTypes: [MESSAGE_TYPE_POINTCLOUD2],
    description: `Adds a visualization represented by a sensor_msgs/PointCloud2 topic to the scene.
    ![](/image/viz/viz-pointcloud.png "")`,
    docsLink: `${DOCS_ROOT_URL}Point-Cloud-2`,
  },
  {
    type: VIZ_TYPE_POSE,
    icon: '/image/icons/icon_pose.svg',
    messageTypes: [MESSAGE_TYPE_POSESTAMPED],
    description: `Adds a visualization represented by a geometry_msgs/PoseStamped topic to the scene.
    ![](/image/viz/viz-pose.png "")`,
    docsLink: `${DOCS_ROOT_URL}Pose`,
  },
  {
    type: VIZ_TYPE_POSEARRAY,
    icon: '/image/icons/icon_pose_array.svg',
    messageTypes: [MESSAGE_TYPE_POSEARRAY],
    description: `Adds a visualization represented by a geometry_msgs/PoseArray topic to the scene. An array of pose is added to the scene based on the Shape type selected.
    ![](/image/viz/viz-posearray.png "")`,
    docsLink: `${DOCS_ROOT_URL}Pose-Array`,
  },
  {
    type: VIZ_TYPE_ROBOTMODEL,
    icon: '/image/icons/icon_robot_model.svg',
    messageTypes: [MESSAGE_TYPE_ROBOT_MODEL],
    description: `Adds a robot model to the scene from a ros parameter.
    ![](/image/viz/viz-robotmodel.png "")`,
    docsLink: `${DOCS_ROOT_URL}Robot-Model`,
  },
  {
    type: VIZ_TYPE_TF,
    icon: '/image/icons/icon_tf.svg',
    messageTypes: TF_MESSAGE_TYPES,
    description: `Adds a visualization represented by a tf/tfMessage and tf2_msgs/TFMessage topic to the scene.
    ![](/image/viz/viz-tf.png "")`,
    docsLink: `${DOCS_ROOT_URL}Tf`,
  },
];

export const DEFAULT_CONFIG = {
  panels: {
    sidebar: {
      display: true,
    },
    tools: {
      display: false,
    },
    info: {
      display: false,
    },
  },
  ros: {
    endpoint: 'ws://10.91.1.111:9090',
  },
  visualizations: [
    // {
    //   vizType: 'Path',
    //   topicName: '/path_rosbag',
    //   messageType: 'nav_msgs/Path',
    //   name: 'Path',
    //   key: '1',
    //   visible: true,
    // },
    // {
    //   vizType: 'Tf',
    //   topicName: '',
    //   name: 'Tf',
    //   key: '2',
    //   visible: true,
    // },
    // {
    //   vizType: 'Marker',
    //   topicName: '/cube_list',
    //   messageType: 'visualization_msgs/Marker',
    //   name: 'Marker',
    //   key: '3',
    //   visible: true,
    // },
    // {
    //   vizType: 'MarkerArray',
    //   topicName: '/markers_demo',
    //   messageType: 'visualization_msgs/MarkerArray',
    //   name: 'Markerarray',
    //   key: '4',
    //   visible: true,
    // },
    // {
    //   vizType: 'Odometry',
    //   topicName: '/odom_rosbag',
    //   messageType: 'nav_msgs/Odometry',
    //   name: 'Odom',
    //   key: '5',
    //   visible: true,
    // },
    {
      vizType: 'RobotModel',
      topicName: 'robot_description',
      messageType: '',
      name: 'Robot',
      key: '10',
      visible: true,
      packages: {
        franka_description:
          'https://storage.googleapis.com/kompose-artifacts/franka_description',
      },
    },
    // {
    //   vizType: 'LaserScan',
    //   topicName: '/laser_scan',
    //   messageType: 'sensor_msgs/LaserScan',
    //   name: 'Laser',
    //   key: '6',
    //   visible: true,
    // },
    // {
    //   vizType: 'Map',
    //   topicName: '/occupancy_grid',
    //   messageType: 'nav_msgs/OccupancyGrid',
    //   name: 'Map',
    //   key: '7',
    //   visible: true,
    // },
    // {
    //   vizType: 'Pose',
    //   topicName: '/pose_stamped',
    //   messageType: 'geometry_msgs/PoseStamped',
    //   name: 'Pose',
    //   key: '8',
    //   visible: true,
    // },
    // {
    //   vizType: 'PoseArray',
    //   topicName: '/pose_array_rosbag',
    //   messageType: 'geometry_msgs/PoseArray',
    //   name: 'Posearray',
    //   key: '9',
    //   visible: true,
    // },
  ],
  globalOptions: {
    display: true,
    backgroundColor: {
      display: true,
      // value: DEFAULT_OPTIONS_SCENE.backgroundColor,
      value: "#000"
    },
    fixedFrame: {
      display: true,
      value: 'world',
    },
    grid: {
      display: true,
      size: 1,
      divisions: 100,
      color: "#333",
      centerlineColor: "#555"
      // size: DEFAULT_OPTIONS_SCENE.gridSize,
      // divisions: DEFAULT_OPTIONS_SCENE.gridDivisions,
      // color: DEFAULT_OPTIONS_SCENE.gridColor,
      // centerlineColor: DEFAULT_OPTIONS_SCENE.gridCenterlineColor,
    },
  },
  tools: {
    mode: 'controls',
    controls: {
      display: false,
      enabled: true,
    },
    measure: {
      display: false,
    },
    custom: [
      {
        name: 'Nav goal',
        type: 'publishPose',
        topic: '/navgoal',
      },
      {
        name: 'Nav goal',
        type: 'publishPoseWithCovariance',
        topic: 'initialpose',
      },
    ],
  },
};

export function updateOptionsUtil(e) {
  const {
    options: { key },
    updateVizOptions,
  } = this.props;
  const {
    checked,
    value,
    dataset: { id: optionId },
  } = e.target;
  updateVizOptions(key, {
    [optionId]: _.has(e.target, 'checked') ? checked : value,
  });
}
