import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SysRoutingModule } from './sys-routing.module';
import { SysMenuComponent } from './menu/menu.component';
import { SysMenuViewComponent } from './menu/view/view.component';
import { SysMenuEditComponent } from './menu/edit/edit.component';
import { SysOrgComponent } from './org/org.component';
import { SysOrgViewComponent } from './org/view/view.component';
import { SysOrgEditComponent } from './org/edit/edit.component';
import { SysDictComponent } from './dict/dict.component';
import { SysDictEditComponent } from './dict/edit/edit.component';
import { SysDictTypeComponent } from './dict/dict-type/dict-type.component';
import { SysDictTypeEditComponent } from './dict/dict-type/edit/edit.component';
import { SysDictTypeViewComponent } from './dict/dict-type/view/view.component';
import { SysAclComponent } from './acl/acl.component';
import { SysRoleComponent } from './role/role.component';
import { SysUserComponent } from './user/user.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserViewComponent } from './user/view/view.component';

const COMPONENTS = [
  SysMenuComponent,
  SysOrgComponent,
  SysDictComponent,
  SysAclComponent,
  SysRoleComponent,
  SysUserComponent];
const COMPONENTS_NOROUNT = [
  SysMenuViewComponent,
  SysMenuEditComponent,
  SysOrgViewComponent,
  SysOrgEditComponent,
  SysDictEditComponent,
  SysDictTypeComponent,
  SysDictTypeEditComponent,
  SysDictTypeViewComponent,
  SysUserEditComponent,
  SysUserViewComponent];

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
