import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerSetComponent } from './set/set.component';
import { PerSetBaseComponent } from './set/base/base.component';
import { PerSetSecurityComponent } from './set/security/security.component';
import { ACLGuard, ACLType } from '@delon/acl';

const routes: Routes = [

  { path: 'set', component: PerSetComponent, children: [
    { path: '', redirectTo: 'base', pathMatch: 'full' }, // 路由重定向
    { path: 'base', component: PerSetBaseComponent, data: { titleI18n: '个人设置' } },
    { path: 'security', component: PerSetSecurityComponent, data: { titleI18n: '安全设置' } },
  ],
  canActivateChild: [ ACLGuard ],
  data: { guard: <ACLType>{ role: [ 'perset' ] } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerRoutingModule { }
