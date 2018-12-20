import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper, DrawerHelperOptions, DrawerHelper } from '@delon/theme';
import { STColumn, STComponent, STPage, STChange } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { Urls } from 'app/util/url';
import { NzMessageService } from 'ng-zorro-antd';
import { PageParam } from 'app/model/pageParam';
import { SysDictEditComponent } from './edit/edit.component';
import { SysDictTypeComponent } from './dict-type/dict-type.component';

@Component({
  selector: 'app-sys-dict',
  templateUrl: './dict.component.html',
  styleUrls: ['./dict.component.less']
})
export class SysDictComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    dictList: Urls.dictList, // 获取字典列表接口
    dictDel: Urls.dicts, // 删除字典接口
    dictSearch: Urls.dictSearch // 搜索字典接口
  };
  // 分页配置
  pi = 0; // 默认的页码数
  ps = 10; // 默认的每页展示多少数据
  total: any; // 返回的菜单总数据个数
  // 数据接收
  dictData: any[] = []; // 返回字典信息列表
  // sf配置
  @ViewChild('sf') sf: SFComponent;
  searchSchema: SFSchema = {
    properties: {
      dsc: {
        type: 'string',
        title: '',
        ui: { placeholder: '字典名称、字典类型' }
      }
    }
  };

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private drawer: DrawerHelper,
    public msgSrv: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }

  // 加载字典页面时获取必要数据
  getData() {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    // 获取字典列表
    this.http.get(this.apiUrl.dictList, pageParam).subscribe((res: any) => {
      this.dictData = res.list;
      this.total = res.total;
    });
  }

  // 新增、编辑字典
  openEdit(dict: any = {}) {
    this.modal
      .createStatic(SysDictEditComponent, {dict})
      .subscribe(res => {
        if (dict.id) {
          dict = Object.assign(dict, res);
        } else {
          this.dictData = [...this.dictData, res];
          this.total = this.dictData.length;
        }
      });
  }

  // 删除字典
  delDict(record: any = {}) {
    this.http.delete(this.apiUrl.dictDel + '/' + `${record.id}`)
    .subscribe((res: any) => {
      this.dictData = this.dictData.filter(d => d.id !== record.id);
      this.total = this.dictData.length;
      this.onSuccess(res, '删除成功');
    }, (error: any) => {
      this.onError(error, '删除失败');
    });
  }

  // 查看所属字典类型
  openDictType(dict: any = {}) {
    const drawerHelperOpt: DrawerHelperOptions = {size: 800};
    this.drawer
      .create(dict.name + '列表', SysDictTypeComponent, { dict }, drawerHelperOpt)
        .subscribe((res) => {
      }
    );
  }

  // 在字典列表中搜索（通过字典铝管或字典类型）
  searchDict(event: any) {
    const pageParam: PageParam = { page: this.pi, size: this.ps };
    this.http.get(this.apiUrl.dictSearch + '/' + event.dsc, pageParam).subscribe((res: any) => {
      this.dictData = res.list;
      this.total = res.total;
    });
  }

  // 重置字典列表
  resetDict() {
    this.getData();
  }

  // 当前页码改变时的回调函数
  pageIndexChange(pi: number) {
    const pageParam: PageParam = { page: pi - 1, size: this.ps };
    this.http.get(this.apiUrl.dictList, pageParam).subscribe((res: any) => {
      this.dictData = res.list;
      this.total = res.total;
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
