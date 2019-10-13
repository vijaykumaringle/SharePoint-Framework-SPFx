import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './UserWelcomeMessageWebPart.module.scss';
import * as strings from 'UserWelcomeMessageWebPartStrings';


export interface IUserWelcomeMessageWebPartProps {
  description: string;
}


export default class UserWelcomeMessageWebPart extends BaseClientSideWebPart<IUserWelcomeMessageWebPartProps> {

  public render(): void {
    let webtitle: string = this.context.pageContext.web.title;
    let dispName: string = this.context.pageContext.user.displayName;
    let dispName1 = dispName.split(/,\s*/);
    this.domElement.innerHTML = `
      <div class="${ styles.userWelcomeMessage }">
        <div class="${ styles.container }">
            <span id="displayusermsg" class="${ styles.title }">Welcome ${dispName1[1]} ${dispName1[0]} to the ${webtitle} site!</span>
            <p class="${ styles.description }">${escape(this.properties.description)}</p>
        </div>
      </div>`;

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                  label: strings.DescriptionFieldLabel,
                  multiline: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
