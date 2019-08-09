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
  ILayoutRestorer, JupyterLab, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette, WidgetTracker, IWidgetTracker, MainAreaWidget
} from '@jupyterlab/apputils';

import {
  IFileBrowserFactory
} from '@jupyterlab/filebrowser';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IMainMenu
} from '@jupyterlab/mainmenu';

import {
  ITerminal
} from '@jupyterlab/terminal';

import {
  PathExt
} from '@jupyterlab/coreutils';

import {
  Token
} from '@phosphor/coreutils';

import {
  ZethusWidget, ZethusFactory
} from './editor';

(window as any).ws = WebSocket;

/**
 * The name of the factory that creates editor widgets.
 */
const FACTORY = 'Zethus';

interface IZethusTracker extends IWidgetTracker<ZethusWidget> { }

export
  const IZethusTracker = new Token<IZethusTracker>('zethus/tracki');

/**
 * The editor tracker extension.
 */
const plugin: JupyterFrontEndPlugin<IZethusTracker> = {
  activate,
  id: '@jupyterlab/zethus-extension:plugin',
  requires: [IFileBrowserFactory, ILayoutRestorer, IMainMenu, ICommandPalette],
  optional: [ILauncher],
  provides: IZethusTracker,
  autoStart: true
};

export default plugin;

function activate(app: JupyterLab,
  browserFactory: IFileBrowserFactory,
  restorer: ILayoutRestorer,
  menu: IMainMenu,
  palette: ICommandPalette,
  launcher: ILauncher | null
): IZethusTracker {

  const namespace = 'zethus';
  const factory = new ZethusFactory({ name: FACTORY, fileTypes: ['zethus'], defaultFor: ['zethus'] });
  const { commands } = app;
  const tracker = new WidgetTracker<ZethusWidget>({ namespace });

  /**
   * Whether there is an active DrawIO editor.
   */
  function isEnabled(): boolean {
    return tracker.currentWidget !== null &&
      tracker.currentWidget === app.shell.currentWidget;
  }

  // from the git extension
  function findCurrentFileBrowserPath(): [string, string] {
    try {
      let selected_element = browserFactory.defaultBrowser.selectedItems().next();
      return [browserFactory.defaultBrowser.model.path, selected_element.path];
    } catch (err) {}
  }

  console.log(app)

  commands.addCommand("zethus:launch-simulation", {
    execute: async (args) => {

      // const widget = tracker.currentWidget;
      // console.log(widget);
      // if (!widget) {
      //   return;
      // }
      // console.log(widget.selectedItems())

      const main = (await commands.execute(
        'terminal:create-new',
        args
      )) as MainAreaWidget<ITerminal.ITerminal>;

      const terminal = main.content;
      let currentFile = findCurrentFileBrowserPath();

      const scnd = commands.execute('docmanager:open', {
        path: currentFile[1], factory: FACTORY
      });

      try {
        terminal.session.send({
          type: 'stdin',
          content: [
            'cd "' + PathExt.basename(currentFile[0]) + '"\n' + "PATH=$(getconf PATH):/usr/local/bin && unset PYTHONPATH && source ~/catkin_ws/devel/setup.bash\n" + "roslaunch test.launch\n"
          ]
        });
        return main;
      } catch (e) {
        console.error(e);
        main.dispose();
      }
    },
    isVisible: () => {
      return true;
    },
    label: 'Launch Simulation'
  }
  );

  const zethusCSSSelector = '.jp-DirListing-item[title$=".zethus"]'

  app.contextMenu.addItem({
    command: "zethus:launch-simulation",
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
    widget.title.icon = 'jp-MaterialIcon jp-ImageIcon'; // TODO change

    // Notify the instance tracker if restore data needs to update.
    widget.context.pathChanged.connect(() => { tracker.save(widget); });
    tracker.add(widget);
  });
  app.docRegistry.addWidgetFactory(factory);

  // Function to create a new untitled diagram file, given
  // the current working directory.
  const createNewDIO = (cwd: string) => {
    return commands.execute('docmanager:new-untitled', {
      path: cwd, type: 'file', ext: '.zethus'
    }).then(model => {
      return commands.execute('docmanager:open', {
        path: model.path, factory: FACTORY
      });
    });
  };

  app.docRegistry.addFileType({
    name: 'zethus',
    displayName: 'Diagram',
    mimeTypes: ['application/zethus'],
    extensions: ['.zethus'],
    iconClass: 'jp-MaterialIcon jp-ImageIcon',
    fileFormat: 'text'
  });

  // const createNewSVG = (cwd: string) => {
  //   return commands.execute('docmanager:new-untitled', {
  //     path: cwd, type: 'file', ext: '.svg'
  //   }).then(model => {
  //     let wdg = app.shell.currentWidget as any;
  //     model.content = wdg.getSVG();
  //     model.format = 'text'
  //     app.serviceManager.contents.save(model.path, model);
  //   });
  // };

  // Add a command for creating a new diagram file.
  commands.addCommand('zethus:create-new', {
    label: 'Robot',
    iconClass: 'jp-MaterialIcon jp-ImageIcon',
    caption: 'Create a new zethus file',
    execute: () => {
      let cwd = browserFactory.defaultBrowser.model.path;
      return createNewDIO(cwd);
    }
  });

  commands.addCommand('zethus:launch', {
    label: 'Launch Zethus',
    caption: 'Launch the robot viewer',
    execute: () => {
      // console.log("Launching.");
      let cwd = browserFactory.defaultBrowser.model.path;
      return createNewDIO(cwd);
    },
    isEnabled
  });

  // Add a launcher item if the launcher is available.
  if (launcher) {
    launcher.add({
      command: 'zethus:launch',
      rank: 1,
      category: 'Other'
    });
  }

  return tracker;
}
