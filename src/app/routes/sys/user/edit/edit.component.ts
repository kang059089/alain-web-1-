import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Urls } from 'app/util/url';
import { SFComponent, SFSchema } from '@delon/form';

@Component({
  selector: 'app-sys-user-edit',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    userRegister: Urls.userRegister, // 用户注册接口
    users: Urls.users // 修改用户信息的接口
  };
  @Input()
  userParam: any = {}; // 接收用户父组件传过来的用户参数
  title: any; // 模态框标题
  isLoading: any; // 加载状态
  roles: any[] = []; // 选择的角色
  orgs: any[] = []; // 选择的组织机构

  // sf配置
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      login: { type: 'string', title: '登录名', maxLength: 50, ui: { grid: { span: 12 } } },
      password: { type: 'string', title: '密码', ui: { type: 'password', grid: { span: 12 } } },
      roles: { type: 'string', title: '角色', ui: { widget: 'custom', grid: { span: 12 } } },
      orgs: { type: 'string', title: '所属机构', ui: { widget: 'custom', grid: { span: 12 } } },
      email: { type: 'string', title: '邮箱', ui: { grid: { span: 12 } } },
      telephone: { type: 'string', title: '手机号码', ui: { grid: { span: 12 } } },
      activated: { type: 'boolean', title: '激活', ui: { checkedChildren: '已激活', unCheckedChildren: '未激活' } }
    },
    required: ['login', 'password', 'email'],
    ui: {
      spanLabelFixed: 120,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.userParam);
    this.setTitle();
  }

  // 设置模态框标题
  setTitle() {
    if (!this.userParam.user.id) {
      this.title = '新增 用户';
    } else {
      this.title = '编辑 ' + this.userParam.user.login;
      this.userParam.user.roles.forEach(element => {
        this.roles.push(element + '');
      });
      this.userParam.user.password = '888888';
    }
  }

  // 选择角色回调函数
  onRoleIdChange(event: any) {
    this.roles = event;
  }

  // 选择组织机构回调函数
  onOrgIdChange(event: any) {
    this.orgs = event;
  }

  // 保存用户或编辑用户信息
  save(user: any) {
    user.roles = this.roles;
    user.orgs = this.orgs;
    if (user.id !== undefined) {
      this.http.put(this.apiUrl.users, user).subscribe((res: any) => {
        console.log(res);
        this.onSuccess(res, '修改成功');
      }, (error) => {
        this.onError(error, '修改失败');
      });
    } else {
      console.log(user);
      this.http.post(this.apiUrl.userRegister, user).subscribe((res: any) => {
        this.onSuccess(res, '创建用户成功');
      }, (error) => {
        this.onError(error, '创建用户失败');
      });
    }
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
