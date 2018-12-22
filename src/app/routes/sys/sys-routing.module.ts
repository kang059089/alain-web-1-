import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysMenuComponent } from './menu/menu.component';
import { ACLGuard } from '@delon/acl';
import { SysOrgComponent } from './org/org.component';
import { SysDictComponent } from './dict/dict.component';
import { SysAclComponent } from './acl/acl.component';

const routes: Routes = [

  { path: 'menu', component: SysMenuComponent, canActivate: [ ACLGuard ], data: { guard: 'menu' } },
  { path: 'org', component: SysOrgComponent, canActivate: [ ACLGuard ], data: { guard: 'org' } },
  { path: 'dict', component: SysDictComponent, canActivate: [ ACLGuard ], data: { guard: 'dict' }  },
  { path: 'acl', component: SysAclComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
