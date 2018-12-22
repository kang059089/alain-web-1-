import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTreeComponent, NzDropdownContextComponent, NzTreeNode, NzMessageService,
  NzFormatEmitEvent, NzDropdownService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Urls } from 'app/util/url';

@Component({
  selector: 'app-sys-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.less']
})
export class SysAclComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    aclMenuTree: Urls.aclMenuTree, // 获取权限树结构接口
    buttons: Urls.buttons // 增加、修改、删除权限按钮的接口
  };

  // 数据接收
  @ViewChild('aclTreeCom') aclTreeCom: NzTreeComponent;
  aclTreeData: any[] = []; // 返回权限树
  dropdown: NzDropdownContextComponent;
  activedNode: NzTreeNode;
  isShowView: boolean; // 显示、隐藏权限查看信息
  isShowEdit: boolean; // 显示、隐藏权限编辑
  title: any; // 权限查看、编辑标题
  node: any; // 修改、删除、添加子项的节点
  validateForm: FormGroup;
  isLoading: any; // 加载状态

  constructor(
    private http: _HttpClient,
    private nzDropdownService: NzDropdownService,
    private fb: FormBuilder,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      id: [],
      name: [ '', [ Validators.required ]],
      acl: [ '', [ Validators.required ]],
      sort: [ '', [ Validators.required ]],
      description: []
    });
    this.getData();
  }

  // 获取权限树
  getData() {
    this.http.get(this.apiUrl.aclMenuTree).subscribe((res: any) => {
      this.aclTreeData = res;
    });
  }

  // 查看权限信息
  aclView(data: NzFormatEmitEvent): void {
    this.activedNode = data.node;
    this.isShowView = true;
    this.isShowEdit = !this.isShowView;
    this.title = '查看 ' + this.activedNode.title;
  }

  // 添加子项（增加下级权限按钮或修改权限按钮）
  aclEdit(node: any) {
    this.isShowEdit = true;
    this.isShowView = !this.isShowEdit;
    if (node) {
        this.title = '编辑 ' + node.origin.title + ' 按钮权限';
        this.validateForm.setValue({
          id: node.origin.key,
          name : node.origin.title,
          acl: node.origin.acl,
          sort: node.origin.sort,
          description: node.origin.description
        });
    } else {
        this.title = '新增 ' + this.node.title + ' 下按钮权限';
        this.validateForm.reset();
    }
    this.dropdown.close();
  }

  // 保存新增权限按钮或编辑权限按钮
  save(event: any, value: any) {
    this.isLoading = true;
    if (value.id) {
      value.menuPid = this.node.origin.pid;
      this.http.put(this.apiUrl.buttons, value).subscribe((res: any) => {
        this.onSuccess(res, '修改成功', event);
      }, (error) => {
        this.onError(error, '修改失败', event);
      });
    } else {
      value.menuPid = this.node.origin.key;
      this.http.post(this.apiUrl.buttons, value).subscribe((res: any) => {
        this.onSuccess(res, '创建权限按钮成功', event);
      }, (error) => {
        this.onError(error, '创建权限按钮失败', event);
      });
    }
  }

  // 删除权限按钮
  aclDel(event: any, node: any) {
    this.dropdown.close();
    this.http.delete(this.apiUrl.buttons + '/' + `${node.origin.key}`)
    .subscribe((res: any) => {
      this.onSuccess(res, '删除成功', event);
    }, (error) => {
      this.onError(error, '删除失败', event);
    });
  }

  // 重置
  reset(event: MouseEvent) {
    this.validateForm.reset();
  }

  // 左侧树结构上动作(增、删、改)的回调
  contextMenu(node: any, $event: MouseEvent, template: TemplateRef<void>): void {
    this.node = node;
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  // 成功的回调函数
  onSuccess(res: any, dsc?: string, event?: any) {
    this.isLoading = false;
    this.msgSrv.success(dsc);
    this.isShowView = false;
    this.isShowEdit = false;
    // 新建、编辑、删除成功重新获取数据
    this.getData();
  }

  // 失败的回调函数
  onError(error: any, dsc?: string, event?: any) {
    this.isLoading = false;
    this.msgSrv.error(dsc);

    event.preventDefault();
    // tslint:disable-next-line:forin
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

}
