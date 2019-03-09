import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFComponent, SFSchema } from '@delon/form';
import { Urls } from 'app/util/url';

@Component({
    selector: 'app-per-set-security-emailedit',
    templateUrl: './emailEdit.component.html',
})
export class PerSetSecurityEmailEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    sendEmail: Urls.sendEmail, // 向用户邮箱发送验证码接口
    changeEmail: Urls.changeEmail, // 绑定新邮箱接口
  };
  @Input()
  email: any; // 接收传过来的用户邮箱
  showEmail: any; // 显示用户绑定的邮箱
  editEmail: any; // 控制是否可编辑邮箱
  newEmail: any; // 输入的新邮箱
  newEmailRes: any; // 返回的新邮箱
  newEmailValid: any = true; // 校验输入的新邮箱
  newEmailTip: any; // 新邮箱校验错误提示
  captcha: any; // 输入的验证码
  isLoading: any; // 加载状态

  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
        email: {
        type: 'string',
        title: '您绑定的邮箱',
        ui: {
          widget: 'custom',
          grid: { span: 6 }
        }
      },
      captcha: {
        type: 'string',
        title: '验证码',
        ui: {
          widget: 'custom',
          grid: { span: 6 }
        }
      }
    },
    ui: {
      spanLabelFixed: 120,
      // grid: { span: 12 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    this.editEmail = false;
    this.newEmail = this.email;
    this.showEmail = this.email.replace(/(.{2}).+(.{2}@.+)/g, '$1****$2');
  }

  // 点击更换邮箱，编辑邮箱
  changeEmail() {
    this.newEmail = '';
    this.editEmail = !this.editEmail;
  }

  // 校验输入的新邮箱格式
  getNewEmail(event: any) {
    const pattern = (/^\w+@[a-z0-9]+\.[a-z]+$/i);
    if (!pattern.test(event)) {
        this.newEmailValid = false;
        this.newEmailTip = '*输入的邮箱格式有误！';
    } else {
        this.newEmailValid = true;
    }
  }

   // tslint:disable-next-line:member-ordering
   count = 0;
   // tslint:disable-next-line:member-ordering
   interval$: any;
   // 获取验证码
   getCaptcha() {
     this.count = 59;
     this.interval$ = setInterval(() => {
       this.count -= 1;
       if (this.count <= 0) clearInterval(this.interval$);
     }, 1000);
     // 向用户发送短信接口
     this.http.get(this.apiUrl.sendEmail + '/' + this.newEmail).subscribe((res: any) => {
        this.newEmailRes = res['email'];
        this.msgSrv.success('邮箱验证码发送成功');
     }, (error) => {
        this.msgSrv.error('邮箱验证码发送失败');
     });
   }

   // 保存绑定的邮箱
   save() {
    if (this.newEmailRes) {
      if (this.newEmail !== this.newEmailRes) {
        this.newEmailValid = false;
        this.newEmailTip = '*输入的邮箱与发送验证码的邮箱不一致！';
        return;
      }
    }
    this.http.post(this.apiUrl.changeEmail + '/' + this.newEmail + '/' + this.captcha).subscribe((res: any) => {
      this.onSuccess(this.newEmail, '绑定邮箱成功');
    }, (error) => {
      this.onError(error, '绑定邮箱失败');
    });
   }

   // 成功的回调函数
  onSuccess(res: any, dsc?: string) {
    this.isLoading = false;
    this.msgSrv.success(dsc);
    this.modal.close(res);
  }

  // 失败的回调函数
  onError(error: any, dsc?: string) {
    this.isLoading = false;
    this.msgSrv.error(dsc);
    this.modal.close();
  }

  close() {
    this.modal.destroy();
  }
}
