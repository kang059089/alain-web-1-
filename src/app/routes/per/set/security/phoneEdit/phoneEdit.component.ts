import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Urls } from 'app/util/url';

@Component({
    selector: 'app-per-set-security-phoneedit',
    templateUrl: './phoneEdit.component.html',
})
export class PerSetSecurityPhoneEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    sendSms: Urls.sendSms, // 向用户发送短信接口
    changePhone: Urls.changePhone, // 绑定新手机号码接口
  };
  @Input()
  telephone: any; // 接收传过来的用户手机号码
  phone: any; // 显示用户绑定的手机号码
  editPhone: any; // 控制是否可编辑手机号码
  securityphone: any; // sf表单默认值
  newPhone: any; // 输入的新手机号码
  newPhoneValid: any = true; // 校验输入的新手机号码
  newPhoneTip: any; // 新手机号码校验错误提示
  captcha: any; // 验证码
  isLoading: any; // 加载状态

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      telephone: {
        type: 'string',
        title: '您绑定的手机',
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
    this.editPhone = false;
    this.newPhone = this.telephone;
    this.phone = this.telephone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
  }

  // 点击更换手机号码，编辑手机号码
  changePhone() {
    this.newPhone = '';
    this.editPhone = !this.editPhone;
  }

  // 校验输入的新手机号码格式
  getNewPhone(event: any) {
    const pattern = (/^1[34578]\d{9}$/);
    console.log(event);
    if (!pattern.test(event)) {
        this.newPhoneValid = false;
        this.newPhoneTip = '*输入的手机号码有误！';
    } else {
        this.newPhoneValid = true;
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
    this.http.get(this.apiUrl.sendSms + '/' + this.newPhone).subscribe((res: any) => {
        console.log(res);
    });
  }

  // 保存绑定的手机号码
  save() {
    this.http.post(this.apiUrl.changePhone + '/' + this.newPhone + '/' + this.captcha).subscribe((res: any) => {
      console.log(res);
    });
    console.log(this.newPhone);
    console.log(this.captcha);
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
