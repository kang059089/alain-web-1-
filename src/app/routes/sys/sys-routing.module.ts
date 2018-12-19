import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysMenuComponent } from './menu/menu.component';
import { ACLGuard } from '@delon/acl';

const routes: Routes = [

  { path: 'menu', component: SysMenuComponent, canActivate: [ ACLGuard ], data: { guard: 'menu' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysRoutingModule { }
