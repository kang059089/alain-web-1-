import { SettingsService, _HttpClient, MenuService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
  ITokenModel,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { Urls } from 'app/util/url';
import { ACLService } from '@delon/acl';
import { CacheService } from '@delon/cache';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  error = '';
  type = 0;
  form: FormGroup; // angular表单组件
  userNameError = ''; // 用户名验证错误提示信息(用户名格式错误)
  passwordError = ''; // 密码验证错误提示信息(密码格式错误)
  loginMode = { // 登录方式的选择
    isUser: false, // 账号、密码登录
    isMobile: true, // 手机登录
    isWechat: true // 微信二维码登录
  };

  links = [ // 链接跳转
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];

  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private menuService: MenuService,
    private aclService: ACLService,
    public msg: NzMessageService,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{3,15}$/)]],
      // Validators.pattern(/^[a-zA-Z]\w{5,17}$/)
      password: [null, [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  // #region fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get captcha() {
    return this.form.controls.captcha;
  }
  get remember() {
    return this.form.controls.remember;
  }

  // #endregion

  // switch(ret: any) {
  //   this.type = ret.index;
  // }

  // #region get captcha

  // tslint:disable-next-line:member-ordering
  count = 0;
  // tslint:disable-next-line:member-ordering
  interval$: any;

  getCaptcha() {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({ onlySelf: true });
      this.mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // #endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else if (this.type === 1) {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.http
      .post(Urls.login + '?_allow_anonymous=true', {
        username: this.userName.value,
        password: this.password.value,
        rememberMe: this.remember.value
      })
      .subscribe((res: any) => {
        console.log(res);
        // if (res.msg !== 'ok') {
        //   this.error = res.msg;
        //   return;
        // }
        // 用户信息：包括姓名、头像、邮箱地址
        this.settingsService.setUser(res.user);
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        this.tokenService.set(res);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          // ACL：设置权限为全量
        this.aclService.setFull(true);
        // this.aclService.setFull(false);
        // this.aclService.set({ role: ['nav', 'forecast', 'dataManagement', 'systemManage', 'systemSetup',
        // 'dashboard', 'loadForecasting', 'loadCorrection', 'loadQuery'
        // ] });
          this.router.navigate(['/']);
        });
      }, (error) => {
        console.log(error);
        this.error = error;
      });
  }

  // #region social

  open(type: string) {
    switch (type) {
      case 'user':
        this.type = 0;
        this.loginMode = {
          isUser: false,
          isMobile: true,
          isWechat: true
        };
        break;
      case 'mobile':
        this.type = 1;
        this.loginMode = {
          isUser: true,
          isMobile: false,
          isWechat: true
        };
        break;
      case 'wechat':
        this.type = 2;
        this.loginMode = {
          isUser: true,
          isMobile: true,
          isWechat: false
        };
        break;
    }
  }

  // open(type: string, openType: SocialOpenType = 'href') {
  //   let url = ``;
  //   let callback = ``;
  //   if (environment.production)
  //     callback = 'https://ng-alain.github.io/ng-alain/callback/' + type;
  //   else callback = 'http://localhost:4200/callback/' + type;
  //   switch (type) {
  //     case 'auth0':
  //       url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
  //         callback,
  //       )}`;
  //       break;
  //     case 'github':
  //       url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
  //         callback,
  //       )}`;
  //       break;
  //     case 'weibo':
  //       url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
  //         callback,
  //       )}`;
  //       break;
  //   }
  //   if (openType === 'window') {
  //     this.socialService
  //       .login(url, '/', {
  //         type: 'window',
  //       })
  //       .subscribe(res => {
  //         if (res) {
  //           this.settingsService.setUser(res);
  //           this.router.navigateByUrl('/');
  //         }
  //       });
  //   } else {
  //     this.socialService.login(url, '/', {
  //       type: 'href',
  //     });
  //   }
  // }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
