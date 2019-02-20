import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerSetComponent } from './set/set.component';
import { PerSetBaseComponent } from './set/base/base.component';
import { PerSetSecurityComponent } from './set/security/security.component';

const routes: Routes = [

  { path: 'set', component: PerSetComponent, children: [
    { path: '', redirectTo: 'base', pathMatch: 'full' }, // 路由重定向
    { path: 'base', component: PerSetBaseComponent, data: { titleI18n: '个人设置' } },
    { path: 'security', component: PerSetSecurityComponent, data: { titleI18n: '个人设置' } },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerRoutingModule { }
