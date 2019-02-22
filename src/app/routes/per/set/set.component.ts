import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef,
  ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Router, ActivationEnd } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-per-set',
  templateUrl: './set.component.html',
  styleUrls: ['./set.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerSetComponent implements AfterViewInit, OnDestroy {
  private resize$: Subscription; // 组件对应视图订阅
  private router$: Subscription; // 路由订阅
  mode = 'inline'; // 菜单类型(默认内嵌)
  title: string; // 标题名称
  // 菜单数据
  menus: any[] = [
    {
      key: 'base',
      title: '基本设置',
    },
    {
      key: 'security',
      title: '安全设置',
    },
    {
      key: 'binding',
      title: '账号绑定',
    },
    {
      key: 'notification',
      title: '新消息通知',
    },
  ];

  constructor(
    private http: _HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private el: ElementRef) {
      // 订阅路由事件(监听路由url的变化)
      this.router$ = this.router.events
        .pipe(filter(e => e instanceof ActivationEnd))
        .subscribe(() => this.setActive());
    }

  // 路由url的变化
  private setActive() {
    const key = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.menus.forEach(i => {
      i.selected = i.key === key;
    });
    this.title = this.menus.find(w => w.selected).title;
  }

  // 跳转页面
  to(item: any) {
    // 通过路由跳转页面
    const key = this.router.url.substr(0, this.router.url.lastIndexOf('/') + 1);
    this.router.navigateByUrl( key + `${item.key}` );
  }

  // 组件相应的视图大小调整
  private resize() {
    const el = this.el.nativeElement as HTMLElement;
    let mode = 'inline';
    const { offsetWidth } = el;
    if (offsetWidth < 641 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    if (window.innerWidth < 768 && offsetWidth > 400) {
      mode = 'horizontal';
    }
    this.mode = mode;
    this.cdr.detectChanges();
  }

  // 组件相应的视图初始化之后调用
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    this.resize$ = fromEvent(window, 'resize')
      .pipe(debounceTime(200)) // 组件去抖动的时间为200毫秒
      .subscribe(() => this.resize());
  }

  // 指令销毁前调用
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    // 取消订阅视图及路由
    this.resize$.unsubscribe();
    this.router$.unsubscribe();
  }

}
