import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper, SettingsService } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { zip } from 'rxjs';
import { CacheService } from '@delon/cache';
import { Urls } from 'app/util/url';
import { StaticUrls } from 'app/util/staticUrl';

@Component({
  selector: 'app-per-set-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerSetBaseComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    users: Urls.users, // 通过登录名获取用户信息接口
    avatar: Urls.upLoad, // 上传文件接口
  };
  avatar = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'; // 默认头像
  userLoading = true; // 加载状态
  user: any; // 用户信息
  avatarUpLoad: any; // 头像上传接口

  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msgSrv: NzMessageService,
    public settings: SettingsService) { }

  ngOnInit() {
    // 获取缓存中的登录名
    const login = this.settings.user.login;
    zip(
      // 通过登录名获取用户信息
      this.http.get(this.apiUrl.users + `/${login}`)
    ).subscribe(([res]: any) => {
      this.userLoading = false;
      this.user = res;
      this.avatarUpLoad = this.apiUrl.avatar + `/${login}`;
      if (this.user.imageUrl !== null && this.user.imageUrl !== '') {
        this.avatar = StaticUrls.avatars + this.user.imageUrl;
      }
      this.cdr.detectChanges();
    });
  }

  // 个人资料修改
  save() {
    this.userLoading = true;
    if (this.avatar === 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png') {
      this.user.imageUrl = '';
    }
    this.http.put(this.apiUrl.users, this.user).subscribe((res: any) => {
      this.onSuccess(res, '更新成功');
    }, (error) => {
      this.onError(error, '更新失败');
    });
  }

  // 上传头像改变时的状态
  handleChange(info: { file: UploadFile }) {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      // 上传成功后返回的图片保存地址
      this.avatar = info.file.response.imageUrl;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string) {
    this.userLoading = false;
    this.msgSrv.success(dsc);
    this.cdr.detectChanges();
  }

  // 失败的回调函数
  onError(error: any, dsc?: string) {
    this.userLoading = false;
    this.msgSrv.error(dsc);
    this.cdr.detectChanges();
  }

}
