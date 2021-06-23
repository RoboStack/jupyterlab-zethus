export const default_config = (
  defaultROSEndpoint: string,
  defaultROSPKGSEndpoint: string
) => {
  return `{
        "panels": {
          "sidebar": {
            "display": true,
            "collapsed": false
          },
          "header": {
            "display": true
          },
          "info": {
            "display": true,
            "collapsed": true
          }
        },
        "ros": {
          "endpoint": "${defaultROSEndpoint}",
          "pkgsEndpoint": "${defaultROSPKGSEndpoint}"
        },
        "infoTabs": [],
        "visualizations": [],
        "globalOptions": {
          "display": true,
          "backgroundColor": {
            "display": true,
            "value": 15790320
          },
          "fixedFrame": {
            "display": true,
            "value": "world"
          },
          "grid": {
            "display": true,
            "size": 30,
            "divisions": 30,
            "color": 11184810,
            "centerlineColor": 7368816
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
          "custom": []
        }
      }`;
};
