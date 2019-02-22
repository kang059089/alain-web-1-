import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { StaticUrls } from 'app/util/staticUrl';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.lastName}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item routerLink="/pro/account/center"><i nz-icon type="user" class="mr-sm"></i>
        个人中心
      </div>
      <div nz-menu-item routerLink="/per/set"><i nz-icon type="setting" class="mr-sm"></i>
        个人设置
      </div>
      <li nz-menu-divider></li>
      <div nz-menu-item (click)="logout()"><i nz-icon type="logout" class="mr-sm"></i>
        退出登录
      </div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent {

  avatar = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'; // 默认头像

  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private srv: CacheService,
  ) {
    if (settings.user.imageUrl !== null && settings.user.imageUrl !== '') {
      this.avatar = StaticUrls.avatars + settings.user.imageUrl;
    }
  }

  logout() {
    this.tokenService.clear();
    this.srv.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
}
