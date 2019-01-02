import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-sys-user-view',
  templateUrl: './view.component.html',
})
export class SysUserViewComponent implements OnInit {
  @Input()
  userParam: any = {}; // 接收菜单父组件传过来的菜单参数
  title: any; // 模态框标题

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.userParam);
    this.title = this.userParam.user.login;
  }

  close() {
    this.modal.destroy();
  }
}
