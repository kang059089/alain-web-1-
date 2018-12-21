import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STPage } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Urls } from 'app/util/url';
import { PageParam } from 'app/model/pageParam';
import { NzMessageService } from 'ng-zorro-antd';
import { SysOrgEditComponent } from './edit/edit.component';
import { SysOrgViewComponent } from './view/view.component';

export interface OrgParam {
  org?: any;
  orgTree?: any;
  orgDictType?: any;
}

@Component({
  selector: 'app-sys-org',
  templateUrl: './org.component.html',
})
export class SysOrgComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    orgList: Urls.orgList, // 获取组织机构列表接口
    orgTree: Urls.orgTree, // 获取组织机构树结构接口
    orgDel: Urls.orgs, // 删除组织机构接口
    orgDict: Urls.orgDict, // 获取组织机构类型字典接口
    orgSearch: Urls.orgSearch // 搜索组织机构接口
  };
  // 分页配置
  pageSet: STPage = {front: false, zeroIndexed: true}; // 分页配置（默认后台分页）
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数
  // 数据接收
  orgData: any[] = []; // 返回组织信息列表
  orgTree: any[] = []; // 返回左侧组织机构树
  orgDictType: any; // 返回组织机构类型字典
  treeDsc: any; // 左侧搜索框输入参数（组织机构名或机构编码）
  bodyStyle: any; // 为左侧树结构添加滚动条
  // sf配置
  searchSchema: SFSchema = {
    properties: {
      dsc: {
        type: 'string',
        title: '',
        ui: { placeholder: '机构名称、机构编码' }
      }
    }
  };

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.bodyStyle = {height: '628.66px', overflow: 'auto'};
    this.getData();
  }

  // 加载组织机构页面时获取必要数据
  getData() {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取组织机构列表
    this.http.get(this.apiUrl.orgList, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
    // 获取左侧组织机构树
    this.http.get(this.apiUrl.orgTree).subscribe((res: any) => {
      this.orgTree = res;
    }, (error: any) => {
      this.onError(error);
    });
    // 获取组织机构类型字典
    this.http.get(this.apiUrl.orgDict).subscribe((res: any) => {
      this.orgDictType = res;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 查看组织机构
  openView(org: any = {}) {
    // 向查看组织机构子组件传递参数（org: 选中的组织机构）
    const orgParam: OrgParam = { org: org, orgDictType: this.orgDictType };
    this.modal
      .create(SysOrgViewComponent, { orgParam })
      .subscribe((res: any) => {
    });
  }

  // 新增、编辑组织机构
  openEdit(org: any = {}) {
    // 向组织机构新增、编辑子组件传递参数（org: 选中编辑的组织机构；dataTree：组织机构树结构；orgDictType：组织机构类型）
    const orgParam: OrgParam = { org: org, orgTree: this.orgTree, orgDictType: this.orgDictType };
    this.modal
      .createStatic(SysOrgEditComponent, { orgParam })
      .subscribe(res => {
        if (org.id) {
          // 因为存在树结构，所以修改成功则重新获取数据。（成功回调的对象暂时没想到办法加入到树结构数据中）
          if (org.pid !== res.pid) {
            this.getData();
          }
          org = Object.assign(org, res);
        } else {
          // 因为存在树结构，所以创建成功则重新获取数据。（成功回调的对象暂时没想到办法加入到树结构数据中）
          this.getData();
        }
        this.orgData.sort(this.compare);
      }
    );
  }

  // 删除组织机构
  delOrg(record: any = {}) {
    this.http.delete(this.apiUrl.orgDel + '/' + `${record.id}`)
    .subscribe((res: any) => {
      // 因为存在树结构，所以删除成功则重新获取数据。（成功回调的对象暂时没想到办法加入到树结构数据中）
      this.onSuccess(res, '删除成功');
      this.getData();
    }, (error: any) => {
      this.onError(error, '删除失败');
    });
  }

  // 点击左侧树节点触发函数
  clickTreeDsc(event: any) {
    this.searchOrg(event.node.key);
  }

  // 在组织机构列表中搜索（通过组织机构名或编码）
  searchOrg(event: any) {
    const item = event.dsc ? event.dsc : event;
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    this.http.get(this.apiUrl.orgSearch + '/' + item, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
    }, (error: any) => {
      this.onError(error);
    });
  }

  // 重置组织机构列表
  resetOrg(event: any) {
    this.getData();
  }

  // 当前页码改变时的回调函数
  pageIndexChange(pi: number) {
    const pageParam: PageParam = { page: pi - 1, size: this.ps };
    this.http.get(this.apiUrl.orgList, pageParam).subscribe((res: any) => {
      this.orgData = res.list;
      this.total = res.total;
    });
  }

  // 新增、编辑组织后，根据sort重新排序
  compare(obj1: any, obj2: any) {
    let val1 = obj1.sort;
    let val2 = obj2.sort;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
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
