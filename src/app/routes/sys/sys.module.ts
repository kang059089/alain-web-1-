import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SysRoutingModule } from './sys-routing.module';
import { SysMenuComponent } from './menu/menu.component';
import { SysMenuViewComponent } from './menu/view/view.component';
import { SysMenuEditComponent } from './menu/edit/edit.component';

const COMPONENTS = [
  SysMenuComponent];
const COMPONENTS_NOROUNT = [
  SysMenuViewComponent,
  SysMenuEditComponent];

@NgModule({
  imports: [
    SharedModule,
    SysRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SysModule { }
