import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-sys-menu-view',
  templateUrl: './view.component.html',
})
export class SysMenuViewComponent implements OnInit {
  @Input()
  menuParam: any = {}; // 接收菜单父组件传过来的菜单参数
  title: any; // 模态框标题

  constructor(
    private modal: NzModalRef
  ) { }

  ngOnInit(): void {
    this.title = this.menuParam.menu.text;
  }

  close() {
    this.modal.destroy();
  }
}
