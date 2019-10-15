import { browser, by, element } from 'protractor';

export class AppPage {

  public getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
  public navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }
}
