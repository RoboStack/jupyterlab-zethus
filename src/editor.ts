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

import Zethus from './thirdparty/zethus/src/zethus';

import "../style/common.css";
import "../style/sidebar.css";
import "../style/viewport.css";
import "../style/modal.css";

import {
  ABCWidgetFactory, DocumentRegistry,  DocumentWidget,
} from '@jupyterlab/docregistry';

import {
  Toolbar
} from '@jupyterlab/apputils';

import {
  IChangedArgs, PathExt
} from '@jupyterlab/coreutils';

import {
  Widget
} from '@phosphor/widgets';

import {
  Message
} from '@phosphor/messaging';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

const DIRTY_CLASS = 'jp-mod-dirty';


export
class ZethusWidget extends DocumentWidget<Widget> {

    constructor(options: DocumentWidget.IOptions<Widget>) {
        super({ ...options });
        this.context = options['context'];

        // this._onTitleChanged();
        // this.context.pathChanged.connect(this._onTitleChanged, this);
        this.context.ready.then(() => { this._onContextReady(); });
        // this.context.ready.then(() => { this._handleDirtyStateNew(); });
    }

    protected onAfterShow(msg: Message): void {
        // this._loadEditor(this.node);
        const editor_value = this.context.model.toString();
        let state = JSON.parse(editor_value);
        console.log(state);
        ReactDOM.render(React.createElement(Zethus, state), this.node);
    }

    public getSVG() : string {
        return "nothing";
        // return mx.mxUtils.getXml(this._editor.editor.graph.getSvg());
    }

    private _onContextReady() : void {
        // const contextModel = this.context.model;

        // // Set the editor model value.
        this._onContentChanged();

        // contextModel.contentChanged.connect(this._onContentChanged, this);
        // contextModel.stateChanged.connect(this._onModelStateChangedNew, this);

        // this._editor.sidebarContainer.style.width = '208px';
        // var footer = document.getElementsByClassName('geFooterContainer');

        // this._editor.refresh();

        // if (footer.length)
        // {
        //     this._editor.footerHeight = 0;
        //     for (let i = 0; i < footer.length; i++)
        //     {
        //         let f = footer[i] as HTMLElement;
        //         f.style.height = '0px';
        //         f.style.display = 'none';
        //     }
        //     this._editor.refresh();
        // }

        // this._ready.resolve(void 0);
    }

    private _loadEditor(node: HTMLElement, contents?: string): void {
    }

    /**
     * Handle a change to the title.
     */
    private _onTitleChanged(): void {
        // this.title.label = PathExt.basename(this.context.localPath);
    }

    private _onContentChanged() : void {
        // if (this._editor === undefined)
        // {
        //     return;
        // }

        // const oldValue = mx.mxUtils.getXml(this._editor.editor.getGraphXml());
        const editor_value = this.context.model.toString();
        let state = JSON.parse(editor_value);
        console.log(state);
        // if (oldValue !== newValue && !this._editor.editor.graph.isEditing()) {
        //     if (newValue.length)
        //     {
        //         let xml = mx.mxUtils.parseXml(newValue);
        //         this._editor.editor.setGraphXml(xml.documentElement);
        //     }
        // }
    }

    private _saveToContext() : void {
        // if (this._editor.editor.graph.isEditing())
        // {
        //     this._editor.editor.graph.stopEditing();
        // }
        // let xml = mx.mxUtils.getXml(this._editor.editor.getGraphXml());
        // this.context.model.fromString(xml);
    }

    private _onModelStateChangedNew(sender: DocumentRegistry.IModel, args: IChangedArgs<any>): void {
        // if (args.name === 'dirty') {
        //     this._handleDirtyStateNew();
        // }
    }

    private _handleDirtyStateNew() : void {
        // if (this.context.model.dirty) {
        //     this.title.className += ` ${DIRTY_CLASS}`;
        // } else {
        //     this.title.className = this.title.className.replace(DIRTY_CLASS, '');
        // }
    }

    /**
     * A promise that resolves when the csv viewer is ready.
     */
    get ready(): Promise<void> {
        return this._ready.promise;
    }

    public content: Widget;
    public toolbar: Toolbar;
    public revealed: Promise<void>;
    readonly context: DocumentRegistry.Context;
    private _editor : any;
    private _ready = new PromiseDelegate<void>();
}

/**
 * A widget factory for drawio.
 */
export
class ZethusFactory extends ABCWidgetFactory<ZethusWidget, DocumentRegistry.IModel> {
    /**
    * Create a new widget given a context.
    */
    constructor(options: DocumentRegistry.IWidgetFactoryOptions){
        super(options);
    }

    protected createNewWidget(context: DocumentRegistry.Context): ZethusWidget {
        return new ZethusWidget({context, content: new Widget()});
    }
}
