import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PerRoutingModule } from './per-routing.module';
import { PerSetComponent } from './set/set.component';
import { PerSetBaseComponent } from './set/base/base.component';
import { PerSetSecurityComponent } from './set/security/security.component';
import { PerSetSecurityAccountEditComponent } from './set/security/accountEdit/accountEdit.component';
import { PerSetSecurityPhoneEditComponent } from './set/security/phoneEdit/phoneEdit.component';

const COMPONENTS = [
  PerSetComponent,
  PerSetBaseComponent,
  PerSetSecurityComponent];
const COMPONENTS_NOROUNT = [
  PerSetSecurityAccountEditComponent,
  PerSetSecurityPhoneEditComponent,
];

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
