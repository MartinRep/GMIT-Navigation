import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { NavigatePage } from '../navigate/navigate';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = AboutPage;
  tab2Root: any = MapPage;
  tab3Root: any = NavigatePage;

  constructor() {

  }
}
