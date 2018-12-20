import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper, MenuService } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { Urls } from 'app/util/url';
import { PageParam } from 'app/model/pageParam';
import { NzMessageService } from 'ng-zorro-antd';
import { SysMenuViewComponent } from './view/view.component';
import { SysMenuEditComponent } from './edit/edit.component';

export interface TreeNodeInterface {
  id: number;
  text: string;
  icon: number;
  link: string;
  level: number;
  expand: boolean;
  sort: number;
  children?: TreeNodeInterface[];
}

export interface MenuParam {
  menu?: any;
  menuTree?: any;
}

@Component({
  selector: 'app-sys-menu',
  templateUrl: './menu.component.html'
})
export class SysMenuComponent implements OnInit {
  // 菜单访问接口
  apiUrl: any = {
    menuTreeList: Urls.menuTreeList, // 获取菜单列表树形数据接口
    menuTree: Urls.menuTree, // 获取菜单树结构接口
    menuDel: Urls.menus, // 删除菜单接口
    menuSearch: Urls.menuSearch // 搜索菜单接口
  };
  // 分页配置
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数
  // 数据接收
  menuTreeListData: any[] = []; // 返回菜单列表树形数据
  menuTreeData; // 返回菜单树结构
  expandDataCache = {};
  // sf配置
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '',
        ui: { placeholder: '菜单名称' }
      }
    }
  };

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private menuService: MenuService,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  // 加载菜单页面时获取必要数据
  getData() {
    // 分页参数配置
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取菜单列表树形数据信息
    this.http.get(this.apiUrl.menuTreeList, pageParam).subscribe((res: any) => {
      this.menuTreeListData = res.list;
      this.total = res.total;
      this.menuTreeListData.forEach(item => {
        this.expandDataCache[ item.id ] = this.convertTreeToList(item);
      });
    });
    // 获取菜单树数据信息
    this.http.get(this.apiUrl.menuTree).subscribe((res: any) => {
      this.menuTreeData = res;
    });
  }

  // 折叠
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  // 将菜单信息转换成树结构
  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[ i ], level: node.level + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }
  // 访问节点
  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[ node.id ]) {
      hashMap[ node.id ] = true;
      array.push(node);
    }
  }

  // 查看菜单
  openView(menu: any = {}) {
    // 向查看菜单子组件传递参数（menu: 选中编辑的菜单）
    const menuParam: MenuParam = { menu: menu };
    this.modal
      .create(SysMenuViewComponent, { menuParam })
      .subscribe((res: any) => {
    });
  }

  // 新增、编辑菜单
  openEdit(menu: any = {}) {
    // 向菜单新增、编辑子组件传递参数（menu: 选中编辑的菜单；menuTree：菜单树结构）
    const menuParam: MenuParam = { menu: menu, menuTree: this.menuTreeData };
    this.modal
      .createStatic(SysMenuEditComponent, { menuParam })
      .subscribe(res => {
        if (menu.id) {
          // 如果编辑了菜单的上级菜单，则重新获取菜单信息(更新左侧菜单栏功能待完成)
          if (menu.pid !== res.pid) {
            this.getData();
          }
          menu = Object.assign(menu, res);
        } else {
          // 新增菜单后，重新获取菜单信息(更新左侧菜单栏功能待完成)
          this.getData();
        }
      });
  }

  // 删除菜单
  delMenu(record: any = {}) {
    this.http.delete(this.apiUrl.menuDel + '/' + `${record.id}`)
    .subscribe((res: any) => {
      // 删除菜单后，重新获取菜单信息(更新左侧菜单栏功能待完成)
      this.onSuccess(res, '删除成功');
      this.getData();
      // this.menuService.add(res.menuList);
    }, (error: any) => {
      this.onError(error, '删除失败');
    });
  }

  // 在菜单列表中搜索（通过菜单名称）
  searchMenu(event: any) {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    this.http.get(this.apiUrl.menuSearch + '/' + event.name, pageParam).subscribe((res: any) => {
      this.menuTreeListData = res.list;
      this.total = res.total;
      this.menuTreeListData.forEach(menu => {
        this.expandDataCache[ menu.id ] = this.convertTreeToList(menu);
      });
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 重置菜单列表
  resetMenu(event: any) {
    this.getData();
  }

  // 当前页码改变时的回调函数
  pageIndexChange(pi: number) {
    const pageParam: PageParam = { page: pi - 1, size: this.ps };
    this.http.get(this.apiUrl.menuTreeNode, pageParam).subscribe((res: any) => {
      this.menuTreeListData = res.list;
      this.total = res.total;
      this.menuTreeListData.forEach(item => {
        this.expandDataCache[ item.id ] = this.convertTreeToList(item);
      });
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
