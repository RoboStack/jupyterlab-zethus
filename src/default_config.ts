export var default_config = (defaultROSEndpoint: string) => {
  return `{
    "panels": {
      "sidebar": {
        "display": true
      },
      "tools": {
        "display": false
      },
      "info": {
        "display": false
      }
    },
    "ros": {
      "endpoint": "${defaultROSEndpoint}"
    },
    "visualizations": [
      {
        "vizType": "RobotModel",
        "topicName": "robot_description",
        "messageType": "",
        "name": "Robot",
        "key": "10",
        "visible": true,
        "packages": {
          "ur_description": "http://localhost:8888/ros_static/ur_description",
          "robotiq_2f_85_gripper_visualization": "http://localhost:8888/ros_static/robotiq_2f_85_gripper_visualization"
        }
      },
      {
        "vizType": "PoseArray",
        "topicName": "/pose_array_rosbag",
        "messageType": "geometry_msgs/PoseArray",
        "name": "Posearray",
        "key": "9",
        "visible": true
      }
    ],
    "globalOptions": {
      "display": true,
      "backgroundColor": {
        "display": true,
        "value": "#1C1C1C"
      },
      "fixedFrame": {
        "display": true,
        "value": "world"
      },
      "grid": {
        "display": true,
        "size": 3,
        "count": 10,
        "color": "#303030"
      }
    },
    "tools": {
      "mode": "controls",
      "controls": {
        "display": false,
        "enabled": true
      },
      "measure": {
        "display": false
      },
      "custom": [
        {
          "name": "Nav goal",
          "type": "publishPose",
          "topic": "/navgoal"
        },
        {
          "name": "Nav goal",
          "type": "publishPoseWithCovariance",
          "topic": "initialpose"
        }
      ]
    }
  }`
}