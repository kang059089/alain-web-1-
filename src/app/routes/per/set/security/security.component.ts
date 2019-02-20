import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, SettingsService, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Urls } from 'app/util/url';
import { zip } from 'rxjs';
import { PerSetSecurityEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-per-set-security',
  templateUrl: './security.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerSetSecurityComponent implements OnInit  {
  // 访问接口
  apiUrl: any = {
    users: Urls.users, // 通过登录名获取用户信息接口
  };
  userLoading = true; // 加载状态
  user: any; // 用户信息
  passwordState: any = 0; // 密码强度（0：弱；1：中；2：强）

  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private modal: ModalHelper,
    public settings: SettingsService) {}

    ngOnInit() {
      // 获取缓存中的登录名
      const login = this.settings.user.login;
      zip(
        // 通过登录名获取用户信息
        this.http.get(this.apiUrl.users + `/${login}`)
      ).subscribe(([res]: any) => {
        this.user = res;
        this.passwordState = this.user.passwordState;
        this.userLoading = false;
        this.cdr.detectChanges();
      });
    }

  // 修改密码
  editPassword() {
    this.modal
      .createStatic(PerSetSecurityEditComponent)
      .subscribe(res => {
        // 密码以字母开头并包含字母、数字及下划线的11-18位字符则属于强密码
        const ptStrong = (/^(?![^a-zA-Z]+$)(?!\D+$)(?![^_]+$).{11,18}$/);
        // 密码以字母开头并包含字母、数字或下划线的8-18位字符则属于中密码
        const ptMiddle = (/^[a-zA-Z]\w{7,17}$/);
        // 密码以字母开头并包含字母、数字或下划线的6-7位字符则属于弱密码
        const ptWeak = (/^[a-zA-Z]\w{5,6}$/);
        if (ptStrong.test(res)) {
          this.passwordState = 2;
        } else if (ptMiddle.test(res)) {
          this.passwordState = 1;
        } else if (ptWeak.test(res)) {
          this.passwordState = 0;
        }
        this.cdr.detectChanges();
      }
    );
  }
}