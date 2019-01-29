import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PerRoutingModule } from './per-routing.module';
import { PerSetComponent } from './set/set.component';
import { PerSetBaseComponent } from './set/base/base.component';

const COMPONENTS = [
  PerSetComponent,
  PerSetBaseComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PerRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class PerModule { }
