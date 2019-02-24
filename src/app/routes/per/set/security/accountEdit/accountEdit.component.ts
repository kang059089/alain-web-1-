import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Urls } from 'app/util/url';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-per-set-security-accountedit',
  templateUrl: './accountEdit.component.html',
})
export class PerSetSecurityAccountEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    checkCurrentPassword: Urls.checkCurrentPassword, // 校验当前密码接口（判断当前密码与原密码是否一致）
    changePassword: Urls.changePassword, // 用户修改密码接口
  };
  isLoading: any; // 加载状态
  newPassWord: any = ''; // 新密码(默认为空字符)

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      currentPassword: {
        type: 'string',
        title: '当前密码',
        ui: {
          type: 'password',
          grid: { span: 6 },
          validator: (value: any) =>
           this.http.get(this.apiUrl.checkCurrentPassword + `/currentPassword${value}`).pipe(
              map(res => {
                  if (res === 1) {
                    return [ { keyword: 'required', message: '当前密码与原密码不一致。'} ];
                  } else if (res === 2) {
                    return [{ keyword: 'required', message: '以字母开头的6~18位字母、数字和下划线。'}];
                  } else {
                    return [];
                  }
                }
              )
            )
        }
      },
      newPassword: {
        type: 'string',
        title: '新密码',
        ui: {
          type: 'password',
          grid: { span: 6 },
          validator: (value: any) => {
            this.newPassWord = value;
            const pattern = (/^[a-zA-Z]\w{5,17}$/);
            return pattern.test(value) === true ? [] : [{ keyword: 'required', message: '以字母开头的6~18位字母、数字和下划线。'}];
          }
        }
      },
      confirmPassword: {
        type: 'string',
        title: '新密码确认',
        ui: {
          type: 'password',
          grid: { span: 6 },
          validator: (value: any) => {
            const pattern = (/^[a-zA-Z]\w{5,17}$/);
            if (pattern.test(value) === true) {
              if (value === this.newPassWord) {
                return [];
              } else {
                return [{ keyword: 'required', message: '与新密码不一致。'}];
              }
            } else {
              return [{ keyword: 'required', message: '以字母开头的6~18位字母、数字和下划线。'}];
            }
          }
        }
      }
    },
    required: ['currentPassword', 'newPassword', 'confirmPassword'],
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

  }

  // 修改密码
  save(passWord: any) {
    this.http.post(this.apiUrl.changePassword, passWord).subscribe((res: any) => {
      this.onSuccess(this.newPassWord, '修改成功');
    }, (error) => {
      this.onError(error, '修改失败');
    });
    console.log(passWord);
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
