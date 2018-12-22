import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzDropdownContextComponent, NzTreeNode, NzDropdownService, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Urls } from 'app/util/url';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less']
})
export class SysRoleComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    roleTree: Urls.roleTree, // 获取角色树结构接口
    roles: Urls.roles, // 增加、修改角色的接口
    aclTree: Urls.aclMenuTree // 获取权限树结构接口
  };
  // 数据接收
  roleTreeData: any[] = []; // 返回左侧菜单树
  aclTreeData: any[] = []; // 返回权限树
  dropdown: NzDropdownContextComponent;
  isShow: boolean; // 显示、隐藏角色编辑框
  title: any; // 角色编辑框的标题名
  validateForm: FormGroup;
  activedNode: NzTreeNode;
  isLoading: any; // 加载状态
  node: any; // 删除、添加子项的节点
  pid: any;
  defaultCheckedKeys: any;

  @ViewChild('aclTreeCom') aclTreeCom;

  constructor(
    private http: _HttpClient,
    private fb: FormBuilder,
    private nzDropdownService: NzDropdownService,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [],
      name: [ '', [ Validators.required ]],
      acl: []
    });
    this.getData();
  }

  getData() {
    // 获取左侧角色树
    this.http.get(this.apiUrl.roleTree).subscribe((res: any) => {
      this.roleTreeData = res;
    });
    // 获取权限树
    this.http.get(this.apiUrl.aclTree).subscribe((res: any) => {
      this.aclTreeData = res;
    });
  }

  // 新增、编辑角色
  roleEdit(event: any) {
    this.isShow = true;
    if (!event || !event.node) {
      this.title = '新增角色';
      this.pid = null;
      if (event && event.key) {
        this.pid = this.node.key;
        this.title = '新增 ' + this.node.title + ' 下角色';
        this.dropdown.close();
      }
      this.validateForm.reset();
      this.defaultCheckedKeys = [];
    } else {
      this.title = '编辑 ' + event.node.origin.title + ' 角色信息';
      this.validateForm.setValue({
        id: event.node.origin.key,
        name : event.node.origin.title,
        acl: event.node.origin.acl,
      });
      this.defaultCheckedKeys = event.node.origin.acl;
    }
  }

  // 保存新增角色或编辑角色
  save(event: any, value: any) {
    this.isLoading = true;
    let acl = '';
    // 获取组件 checkBox 被点击选中的节点，将所选中的acl拼成字符串
    this.aclTreeCom.getCheckedNodeList().forEach(element => {
      acl += element.origin.acl + ',';
    });
    value.acl = acl.length > 0 ? acl.substr(0, acl.length - 1) : acl;
    if (value.id) {
      value.pid = this.node.origin.pid;
      this.http.put(this.apiUrl.roles, value).subscribe((res: any) => {
        this.onSuccess(res, '修改成功', event);
      }, (error) => {
        this.onError(error, '修改失败', event);
      });
    } else {
      value.pid = this.pid;
      this.http.post(this.apiUrl.roles, value).subscribe((res: any) => {
        this.onSuccess(res, '创建角色成功', event);
      }, (error) => {
        this.onError(error, '创建角色失败', event);
      });
    }
  }

  // 删除角色
  roleDel(event: any, node: any) {
    this.dropdown.close();
    this.http.delete(this.apiUrl.roles + '/' + `${node.origin.key}`)
    .subscribe((res: any) => {
      this.onSuccess(res, '删除成功', event);
    }, (error) => {
      this.onError(error, '删除失败', event);
    });
  }

  // 左侧树结构上动作(增、删、改)的回调
  contextMenu(node: any, $event: MouseEvent, template: TemplateRef<void>): void {
    this.node = node;
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string, event?: any) {
    this.isLoading = false;
    this.isShow = false;
    this.msgSrv.success(dsc);
    // 新建、编辑、删除成功重新获取数据
    this.getData();
  }

  // 失败的回调函数
  onError(error: any, dsc?: string, event?: any) {
    this.isLoading = false;
    this.msgSrv.error(dsc);
  }
}
