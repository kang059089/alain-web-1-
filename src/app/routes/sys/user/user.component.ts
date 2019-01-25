import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { Urls } from 'app/util/url';
import { PageParam } from 'app/model/pageParam';
import { NzMessageService } from 'ng-zorro-antd';
import { SysUserEditComponent } from './edit/edit.component';
import { SysUserViewComponent } from './view/view.component';

export interface UserParam {
  user?: any;
  roleTree?: any;
  orgTree?: any;
}

@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html',
})
export class SysUserComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    userList: Urls.userList, // 获取用户列表接口
    users: Urls.users, // 修改、删除用户接口
    userSearch: Urls.userSearch, // 搜索用户接口
    roleTree: Urls.roleTree, // 获取角色树结构接口
    orgTree: Urls.orgTree // 获取角色树结构接口
  };
  // 分页配置
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数
  // 数据接收
  userData: any[] = []; // 返回用户信息列表
  roleTreeData: any[] = []; // 返回角色树
  orgTreeData: any[] = []; // 返回组织机构树
  // sf配置
  @ViewChild('sf') sf: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      dsc: {
        type: 'string',
        title: '',
        ui: { placeholder: '登录名、电话' }
      }
    }
  };

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  // 加载用户页面时获取必要数据
  getData() {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取用户列表
    this.http.get(this.apiUrl.userList, pageParam).subscribe((res: any) => {
      this.userData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
    // 获取角色树
    this.http.get(this.apiUrl.roleTree).subscribe((res: any) => {
      this.roleTreeData = res;
    }, (error: any) => {
      this.onError(error);
    });
    // 获取机构树
    this.http.get(this.apiUrl.orgTree).subscribe((res: any) => {
      this.orgTreeData = res;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 查看用户
  openView(user: any = {}) {
    // 向用户新增、编辑子组件传递参数（user: 选中的用户）
    const userParam: UserParam = { user: user};
    this.modal
      .create(SysUserViewComponent, { userParam })
      .subscribe((res: any) => {
    });
  }

  // 新增、编辑用户
  openEdit(user: any = {}) {
    // 向用户新增、编辑子组件传递参数（user: 选中的用户；roleTreeData：角色树结构；orgTreeData：组织机构树结构）
    const userParam: UserParam = { user: user, roleTree: this.roleTreeData, orgTree: this.orgTreeData };
    this.modal
      .createStatic(SysUserEditComponent, { userParam })
      .subscribe(res => {
        if (user.id) {
          user = Object.assign(user, res);
        } else {
         this.getData();
        }
      }
    );
  }

  // 删除用户
  delUser(record: any = {}) {
    this.http.delete(this.apiUrl.users + '/' + `${record.login}`)
    .subscribe((res: any) => {
      this.userData = this.userData.filter(d => d.id !== record.id);
      this.total = this.userData.length;
      this.onSuccess(res, '删除成功');
      // this.getData();
    }, (error: any) => {
      this.onError(error, '删除失败');
    });
  }

  // 在用户列表中搜索（通过登录名或电话号码）
  searchUser(event: any) {
    const item = event.dsc ? event.dsc : event;
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    this.http.get(this.apiUrl.userSearch + '/' + item, pageParam).subscribe((res: any) => {
      this.userData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 重置用户列表
  resetUser(event: any) {
    this.getData();
  }

  // 改变用户状态
  onActivate(item: any) {
    item.activated = !item.activated;
    // 修改用户状态信息
    this.http.put(this.apiUrl.users, item).subscribe((res) => {
      this.onSuccess(res, '状态修改成功');
      item = Object.assign(item, res);
    }, (error) => {
      item.activated = !item.activated;
      this.onError(error, '状态修改失败');
    });
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string) {
    this.msgSrv.success(dsc);
  }

  // 失败的回调函数
  onError(error: any, dsc?: string) {
    this.msgSrv.error(dsc);
  }

}
