import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Urls } from 'app/util/url';
import { SysDictTypeEditComponent } from './edit/edit.component';
import { PageParam } from 'app/model/pageParam';
import { SysDictTypeViewComponent } from './view/view.component';

export interface DictTypeParam {
  dict?: any;
  dictType?: any;
}

@Component({
  selector: 'app-sys-dict-type',
  templateUrl: './dict-type.component.html',
})
export class SysDictTypeComponent implements OnInit {
  // 访问接口
  apiUrl: any = {
    dictTypeDel: Urls.dictTypes // 删除字典接口
  };
  total: any = 0; // 返回的菜单总数据个数
  @Input()
  dict: any = {}; // 接收字典父组件传过来的字典参数

  constructor(
    private ref: NzDrawerRef,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    if (this.dict.children) {
      this.total = this.dict.children.length;
    }
  }

  // 查看字典类型
  openView(dictType: any = {}) {
    const dictTypeParam: DictTypeParam = {dict: this.dict, dictType: dictType};
    this.modal
      .create(SysDictTypeViewComponent, { dictTypeParam })
      .subscribe((res: any) => {
    });
  }

  // 新增、编辑字典类型
  openEdit(dictType: any = {}) {
    const dictTypeParam: DictTypeParam = {dict: this.dict, dictType: dictType};
    this.modal
      .createStatic(SysDictTypeEditComponent, {dictTypeParam})
      .subscribe(res => {
        if (dictType.id) {
          dictType = Object.assign(dictType, res);
          this.dict.children = [...this.dict.children];
        } else {
          if (this.dict.children) {
            this.dict.children = [...this.dict.children, res];
          } else {
            this.dict.children = [res];
          }
        }
        this.dict.children.sort(this.compare);
      }
    );
  }

  // 删除字典类型
  delDictType(record: any = {}) {
    this.http.delete(this.apiUrl.dictTypeDel + '/' + `${record.id}`)
    .subscribe((res: any) => {
      this.dict.children = this.dict.children.filter(d => d.id !== record.id);
      this.onSuccess(res, '删除成功');
    }, (error: any) => {
      this.onError(error, '删除失败');
    });
  }

  // 新增、编辑字典类型后，根据sort重新排序
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

  close() {
    this.ref.close();
  }
}
