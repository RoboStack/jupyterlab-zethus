// Copyright 2018 Wolf Vollprecht
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { WidgetTracker, IWidgetTracker } from '@jupyterlab/apputils';

import { IFileBrowserFactory } from '@jupyterlab/filebrowser';

import { ILauncher } from '@jupyterlab/launcher';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { Token } from '@lumino/coreutils';

import { ZethusWidget, ZethusFactory } from './editor';

import { Mode } from '@jupyterlab/codemirror';

import { LabIcon } from '@jupyterlab/ui-components';

import '../style/index.css';
import zethusIconSvg from '../style/icon.svg';

/**
 * The name of the factory that creates editor widgets.
 */
const FACTORY = 'Zethus';

export const zethusIcon = new LabIcon({
  name: 'jupyterlab-zethus:icon',
  svgstr: zethusIconSvg
});

type IZethusTracker = IWidgetTracker<ZethusWidget>;

export const IZethusTracker = new Token<IZethusTracker>('zethus/tracki');

/**
 * The editor tracker extension.
 */
const plugin: JupyterFrontEndPlugin<IZethusTracker> = {
  activate,
  id: 'jupyterlab-zethus:plugin',
  requires: [IFileBrowserFactory, ILayoutRestorer, ISettingRegistry],
  optional: [ILauncher],
  provides: IZethusTracker,
  autoStart: true
};

export default plugin;

// function activate(
//   app: JupyterFrontEnd,
//   browserFactory: IFileBrowserFactory,
//   restorer: ILayoutRestorer,
//   menu: IMainMenu,
//   palette: ICommandPalette,
//   launcher: ILauncher | null
// ): IDrawioTracker {

function activate(
  app: JupyterFrontEnd,
  browserFactory: IFileBrowserFactory,
  restorer: ILayoutRestorer,
  settingRegistry: ISettingRegistry,
  launcher: ILauncher | null
): IZethusTracker {
  const namespace = 'zethus';
  const { commands } = app;
  const tracker = new WidgetTracker<ZethusWidget>({ namespace });

  let defaultROSEndpoint = '';
  let defaultROSPKGSEndpoint = '';
  const factory = new ZethusFactory(
    {
      name: FACTORY,
      fileTypes: ['zethus'],
      defaultFor: ['zethus']
    },
    defaultROSEndpoint,
    defaultROSPKGSEndpoint
  );

  const updateSettings = (settings: ISettingRegistry.ISettings): void => {
    defaultROSEndpoint = settings.get('defaultROSEndpoint').composite as string;
    defaultROSPKGSEndpoint = settings.get('defaultROSPKGSEndpoint')
      .composite as string;
    console.log(
      `Updating ROS Endpoint to --> ${defaultROSEndpoint}, ${defaultROSPKGSEndpoint}`
    );
    factory.defaultROSEndpoint = defaultROSEndpoint;
    factory.defaultROSPKGSEndpoint = defaultROSPKGSEndpoint;
  };

  Promise.all([
    settingRegistry.load('jupyterlab-zethus:settings'),
    app.restored
  ])
    .then(([settings]) => {
      updateSettings(settings);
      settings.changed.connect(updateSettings);
    })
    .catch((reason: Error) => {
      console.error(reason.message);
    });

  /**
   * Whether there is an active Zethus viewer.
   */
  function isEnabled(): boolean {
    return (
      tracker.currentWidget !== null &&
      tracker.currentWidget === app.shell.currentWidget
    );
  }

  const zethusCSSSelector = '.jp-DirListing-item[title$=".zethus"]';

  app.contextMenu.addItem({
    command: 'zethus:launch-simulation',
    selector: zethusCSSSelector,
    rank: 1
  });

  // Handle state restoration.
  restorer.restore(tracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: FACTORY }),
    name: widget => widget.context.path
  });

  factory.widgetCreated.connect((sender, widget) => {
    widget.title.icon = 'jp-MaterialIcon ZethusIcon'; // TODO change

    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => {
      tracker.save(widget);
    });
    tracker.add(widget);
  });
  app.docRegistry.addWidgetFactory(factory);

  // Function to create a new untitled diagram file, given
  // the current working directory.
  const createNewZethus = (cwd: string) => {
    return commands
      .execute('docmanager:new-untitled', {
        path: cwd,
        type: 'file',
        ext: '.zethus'
      })
      .then(model => {
        return commands.execute('docmanager:open', {
          path: model.path,
          factory: FACTORY
        });
      });
  };

  app.docRegistry.addFileType({
    name: 'zethus',
    displayName: 'Zethus File',
    mimeTypes: ['application/json'],
    extensions: ['.zethus'],
    icon: zethusIcon,
    fileFormat: 'text'
  });

  app.docRegistry.addFileType({
    name: 'roslaunch',
    displayName: 'ROS Launch File',
    mimeTypes: ['application/xml'],
    extensions: ['.launch'],
    icon: zethusIcon,
    fileFormat: 'text'
  });

  commands.addCommand('zethus:launch', {
    label: 'Zethus',
    icon: zethusIcon,
    caption: 'Launch the Zethus viewer',
    execute: () => {
      const cwd = browserFactory.defaultBrowser.model.path;
      return createNewZethus(cwd);
    },
    isEnabled
  });

  // Add a launcher item if the launcher is available.
  if (launcher) {
    launcher.add({
      command: 'zethus:launch',
      rank: 1,
      category: 'Robotics'
    });
  }

  Mode.getModeInfo().push({
    name: 'ROS Launch',
    mime: 'application/xml',
    mode: 'xml',
    ext: ['launch']
  });

  Mode.getModeInfo().push({
    name: 'Zethus',
    mime: 'application/json',
    mode: 'json',
    ext: ['zethus']
  });

  return tracker;
}
