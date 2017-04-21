import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { MapPage } from '../map/map';
import { NavigatePage } from '../navigate/navigate';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AboutPage;
  tab2Root = MapPage;
  tab3Root = NavigatePage;

  constructor() {

  }
}
