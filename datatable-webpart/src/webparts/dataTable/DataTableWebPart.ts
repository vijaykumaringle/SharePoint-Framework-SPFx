import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DataTableWebPart.module.scss';
import * as strings from 'DataTableWebPartStrings';

import * as $ from 'jquery';
//import 'datatables.net';
import 'DataTables.net';

import { SPComponentLoader } from '@microsoft/sp-loader';

//import SPhttpclient
import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';

//import environments
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
import { IODataList, IODataListItem } from '@microsoft/sp-odata-types';


export interface IDataTableWebPartProps {
  description: string;
  lists: string;
  multiSelect: string[];
}

//interfaces
export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  fitem: any;
  Title: string;
  Id: string;
}

export interface listfields {
  InternalName: string;
  Title: string;
}

let tidran: string = `tid${Math.floor((Math.random() * 1000) + 1)}`;


export default class DataTableWebPart extends BaseClientSideWebPart<IDataTableWebPartProps> {
  
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.dataTable }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <div class="${ styles.title }"> ${this.properties.description}</div>
              <div class="${styles.subTitle}">List view with datatable!</div>
            </div>
          </div>
        </div>
        <div class="${styles.dtablediv}">
          <table id="${tidran}" width="100%">
            <thead>
              <tr id="theadtr"></tr>
            </thead>
          </table>
        </div>
      </div>`;

      SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");  

      this._renderListAsync();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    
    // if (this.properties.lists) {
    //   this.fetchOptions().then((response) => {
    //     this.dropdownOptions = response;
    //     //this.listsFetched = true;
    //     // now refresh the property pane, now that the promise has been resolved..
    //     //this.onDispose();
    //   });
    // }  

    // this.fetchOptions().then((response) => {
    //   this.dropdownOptions = response;
    // });


    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldListPicker('lists', {
                  label: 'Select a list',
                  selectedList: this.properties.lists,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId',
                  baseTemplate: 100
                }),
                PropertyFieldMultiSelect('multiSelect', {
                  key: 'multiSelect',
                  label: "List Fields",
                  options: this.dropdownOptions,
                  selectedKeys: this.properties.multiSelect,
                  disabled: this.dropdowndisabled
                })
              ]
            }
          ]
        }
      ]
    };
  }


  //start fix
  private dropdowndisabled: boolean = true;


  protected onPropertyPaneConfigurationStart(): void {
    this.dropdowndisabled = !this.properties.multiSelect;

    if (this.properties.multiSelect) {
      this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'multiSelect');

      this.fetchOptions().then((response) => {
        this.dropdownOptions = response;
        this.dropdowndisabled = false;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      });

    }

    return;
   
  }


  protected onPropertyPaneFieldChanged(): void {
    //this.dropdowndisabled = !this.properties.lists;
    this.dropdowndisabled = !this.properties.multiSelect;

    if (this.properties.lists) {
      this.context.statusRenderer.displayLoadingIndicator(this.domElement, 'multiSelect');

      this.fetchOptions().then((response) => {
        this.dropdownOptions = response;
        this.dropdowndisabled = false;
        this.context.propertyPane.refresh();
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);
        this.render();
      });
      
    }

    return;
   
  }


  //end fix



  //start propcode
  private dropdownOptions: any[];
  private listsFetched: boolean;

  // protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
  //   if (this.properties.lists) {
  //     this.fetchOptions().then((response) => {
  //       this.dropdownOptions = response;
  //     });
  //     //this.context.propertyPane.refresh();
  //   }
  // }

  // these methods are split out to go step-by-step, but you could refactor and be more direct if you choose..

  private fetchLists(url: string) : Promise<any> {
      return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("WARNING - failed to hit URL " + url + ". Error = " + response.statusText);
          return null;
        }
      });
  }

  private fetchOptions(): Promise<any[]> {
    var url = this.context.pageContext.web.absoluteUrl + `/_api/lists/getbyId('${escape(this.properties.lists)}')/fields?$filter=Hidden eq false and ReadOnlyField eq false`;

    return this.fetchLists(url).then((response) => {
        var options: Array<any> = new Array<any>();
        response.value.map((list: listfields) => {
            console.log("Found list Fields with title = " + list.Title);
            options.push( { key: list.InternalName, text: list.Title });
        });

        return options;
    });
  }
  //end propcode


  //functions for get list data
  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/lists/getbyId('${escape(this.properties.lists)}')/items?$Select=${this.properties.multiSelect}`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _renderList(items: ISPList[]): void {
    const itemIDArray : string[] = [];
    let multiSelectArray : string[] = [];
    multiSelectArray = this.properties.multiSelect;

    items.forEach((item: ISPList) => {
      
      multiSelectArray.forEach((fitem: any) => {
        let aa = fitem;
        console.log(`Field${fitem} -> ${item[aa]}`);
      });

    });

    let aoColData : any = [];
    let nummseleclen : number = this.properties.multiSelect.length - 1;
    let flag : boolean;
    this.properties.multiSelect.forEach((fitem: string) => {
      aoColData.push({data : fitem});
      $('#theadtr').append(`<th>${fitem}</th>`);
      if(this.properties.multiSelect[nummseleclen] == fitem){
        flag = true;
      }
    });
    
    //let passData = aoColData.toString;
    
    if(flag == true){
      let passData = aoColData;
      let itemsjs = items;
      let dttable;
      try{

        dttable = $(`#${tidran}`).DataTable();  
        if (dttable != undefined) {  
          dttable.destroy(); 
            $(`#${tidran} tbody`).remove();
 
        }

        dttable = (<any>$(`#${tidran}`)).DataTable({
          "data": itemsjs,
          "columns": passData,
          "columnDefs": [{
                        "defaultContent": "-",
                        "targets": "_all"
                        }]
        });
      }
      catch(e){
        alert(e.message);
      }
      
    }
    

  }

  private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      alert("Not supported in local workbench");
    }
    else if (Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }
}
