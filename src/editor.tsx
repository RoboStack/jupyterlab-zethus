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

import ReactDOM from 'react-dom';
import React from 'react';

// @ts-ignore
import Zethus from '../zethus/panels.umd.js';

import {
  ABCWidgetFactory,
  DocumentRegistry,
  DocumentWidget
} from '@jupyterlab/docregistry';

import { PathExt } from '@jupyterlab/coreutils';

import { Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { PromiseDelegate } from '@lumino/coreutils';

import { default_config } from './default_config';

// const DIRTY_CLASS = 'jp-mod-dirty';

export class ZethusWidget extends DocumentWidget<Widget> {
  constructor(
    options: DocumentWidget.IOptions<Widget>,
    defaultROSEndpoint: string
  ) {
    super({ ...options });
    this.context = options['context'];
    this._onTitleChanged();
    this.context.pathChanged.connect(this._onTitleChanged, this);
    this.context.ready.then(() => {
      this._onContextReady();
    });
    this.defaultROSEndpoint = defaultROSEndpoint;
    // this.context.ready.then(() => { this._handleDirtyStateNew(); });
  }

  protected loadEditor(state: any): void {
    console.log(state);
    ReactDOM.render(<Zethus configuration={state} />, this.node);
    // React.createElement(Zethus, {configuration: state}), this.node);

    const cvx = this.node.querySelector('canvas');
    if (cvx) {
      cvx.width = this.node.clientWidth; //  = msg.width;
      cvx.height = this.node.clientHeight; // = msg.height;
      cvx.style.width = this.node.clientWidth + 'px';
      cvx.style.height = this.node.clientHeight + 'px';
    }
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    const cvx = this.node.querySelector('canvas');
    if (cvx) {
      cvx.width = msg.width;
      cvx.height = msg.height;
      cvx.style.width = msg.width + 'px';
      cvx.style.height = msg.height + 'px';
    }
  }

  private _onContextReady(): void {
    const contextModel = this.context.model;
    if (this.context.model.toString() === '') {
      this.context.model.fromString(default_config(this.defaultROSEndpoint));
    }
    // // Set the editor model value.
    this._onContentChanged();

    contextModel.contentChanged.connect(this._onContentChanged, this);
    // contextModel.stateChanged.connect(this._onModelStateChangedNew, this);

    // this._editor.sidebarContainer.style.width = '208px';
    // var footer = document.getElementsByClassName('geFooterContainer');

    // this._editor.refresh();

    this._ready.resolve(void 0);
  }

  /**
   * Handle a change to the title.
   */
  private _onTitleChanged(): void {
    this.title.label = PathExt.basename(this.context.localPath);
  }

  private _onContentChanged(): void {
    try {
      const editor_value = this.context.model.toString();
      const state = JSON.parse(editor_value);
      console.log('Loading editro from content chagned!');
      this.loadEditor(state);
    } catch (e) {
      // maybe empty string/
    }
  }

  // private _saveToContext() : void {
  //     // if (this._editor.editor.graph.isEditing())
  //     // {
  //     //     this._editor.editor.graph.stopEditing();
  //     // }
  //     // let xml = mx.mxUtils.getXml(this._editor.editor.getGraphXml());
  //     // this.context.model.fromString(xml);
  // }

  // private _onModelStateChangedNew(sender: DocumentRegistry.IModel, args: IChangedArgs<any>): void {
  //     // if (args.name === 'dirty') {
  //     //     this._handleDirtyStateNew();
  //     // }
  // }

  // private _handleDirtyStateNew() : void {
  //     // if (this.context.model.dirty) {
  //     //     this.title.className += ` ${DIRTY_CLASS}`;
  //     // } else {
  //     //     this.title.className = this.title.className.replace(DIRTY_CLASS, '');
  //     // }
  // }

  protected onBeforeDetach(msg: Message) {
    ReactDOM.unmountComponentAtNode(this.node);
  }

  /**
   * A promise that resolves when the zethus viewer is ready.
   */
  get ready(): Promise<void> {
    return this._ready.promise;
  }

  // private react_elem: any;
  // private _is_rendered: boolean;
  // public content: Widget;
  // public toolbar: Toolbar;
  // public revealed: Promise<void>;
  readonly context: DocumentRegistry.Context;
  // private _editor : any;
  private _ready = new PromiseDelegate<void>();
  private defaultROSEndpoint: string;
}

/**
 * A widget factory for drawio.
 */
export class ZethusFactory extends ABCWidgetFactory<
  ZethusWidget,
  DocumentRegistry.IModel
> {
  /**
   * Create a new widget given a context.
   */
  constructor(
    options: DocumentRegistry.IWidgetFactoryOptions,
    defaultROSEndpoint: string
  ) {
    super(options);
    this.defaultROSEndpoint = defaultROSEndpoint;
  }

  protected createNewWidget(context: DocumentRegistry.Context): ZethusWidget {
    return new ZethusWidget(
      { context, content: new Widget() },
      this.defaultROSEndpoint
    );
  }

  defaultROSEndpoint: string;
}
