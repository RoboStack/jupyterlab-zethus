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
  ABCWidgetFactory,
  DocumentRegistry,
  DocumentWidget
} from '@jupyterlab/docregistry';

import { PathExt, PageConfig } from '@jupyterlab/coreutils';

import { Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { PromiseDelegate } from '@lumino/coreutils';

import { default_config } from './default_config';

// const DIRTY_CLASS = 'jp-mod-dirty';

let zethusEditorId = 0;

export class ZethusWidget extends DocumentWidget<Widget> {
  constructor(
    options: DocumentWidget.IOptions<Widget>,
    defaultROSEndpoint: string,
    defaultROSPKGSEndpoint: string
  ) {
    super({ ...options });
    zethusEditorId += 1;
    this.zethusId = zethusEditorId;
    this.context = options['context'];
    this._onTitleChanged();
    this.context.pathChanged.connect(this._onTitleChanged, this);
    this.context.ready.then(() => {
      this._onContextReady();
    });
    this._defaultROSEndpoint = defaultROSEndpoint;
    this._defaultROSPKGSEndpoint = defaultROSPKGSEndpoint;
    // this.context.ready.then(() => { this._handleDirtyStateNew(); });
  }

  zethusId: number;
  iframe?: HTMLIFrameElement;
  countSetConfig = 0;

  protected loadEditor(state: any): void {
    const baseUrl = PageConfig.getBaseUrl();
    if (!this.iframe) {
      this.iframe = document.createElement('iframe');
      this.iframe.className = 'jp-iframe-zethus';

      const q = encodeURIComponent(JSON.stringify(state));

      this.iframe.src =
        baseUrl +
        `zethus/app/index.html?config=${q}&zethusId=${this.zethusId}&bridge=${this._defaultROSEndpoint}&pkgs=${this._defaultROSPKGSEndpoint}`;

      this.content.node.appendChild(this.iframe);

      window.document.addEventListener(
        `ZethusUpdateConfig${this.zethusId}`,
        (e: any) => {
          if (this.countSetConfig <= 0) {
            this._saveToContext(e.detail.config);
          } else {
            this.countSetConfig--;
          }
        },
        false
      );
    } else {
      this.countSetConfig++;
      const event = new CustomEvent('SetConfig', { detail: { config: state } });
      this.iframe.contentDocument?.dispatchEvent(event);
    }
  }

  // protected onResize(msg: Widget.ResizeMessage): void {}

  private _onContextReady(): void {
    const contextModel = this.context.model;
    if (this.context.model.toString() === '') {
      this.context.model.fromString(
        default_config(this._defaultROSEndpoint, this._defaultROSPKGSEndpoint)
      );
    }
    // Set the editor model value.
    this._onContentChanged();

    contextModel.contentChanged.connect(this._onContentChanged, this);

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
      console.log('Loading editor from content changed!');
      this.loadEditor(state);
    } catch (e) {
      // maybe empty string/
    }
  }

  private _saveToContext(content: any): void {
    console.log('Saving content: ', content);
    this.context.ready.then(() => {
      this.context.model.fromString(JSON.stringify(content, null, 4));
    });
  }

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
    // ReactDOM.unmountComponentAtNode(this.node);
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
  private _defaultROSEndpoint: string;
  private _defaultROSPKGSEndpoint: string;
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
    defaultROSEndpoint: string,
    defaultROSPKGSEndpoint: string
  ) {
    super(options);
    this.defaultROSEndpoint = defaultROSEndpoint;
    this.defaultROSPKGSEndpoint = defaultROSPKGSEndpoint;
  }

  protected createNewWidget(context: DocumentRegistry.Context): ZethusWidget {
    return new ZethusWidget(
      { context, content: new Widget() },
      this.defaultROSEndpoint,
      this.defaultROSPKGSEndpoint
    );
  }

  defaultROSEndpoint: string;
  defaultROSPKGSEndpoint: string;
}
