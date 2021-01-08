import { Component, OnInit } from '@angular/core';
import { ApiService } from '../providers/api.service';
import { Observable } from 'rxjs';
import { Shift } from '../models/shift.interface';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController, AlertController, Platform, ToastController } from '@ionic/angular';
import { RondasPage } from '../modals/rondas/rondas.page';
import { Guard } from '../models/guard.interface';
import { AuthService } from '../providers/auth.service';
/* import { ELocalNotificationTriggerUnit, LocalNotifications } from '@ionic-native/local-notifications/ngx'; */
import { Router } from '@angular/router';
import { $ } from 'protractor';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  shifts$: Observable<Shift[]>
  guard: Guard
  shifts: Shift[]
  shift: Shift

  shiftId
  constructor(
    public toastController: ToastController,
    private api: ApiService,
    private browser: InAppBrowser,
   /*  private localNotifications: LocalNotifications, */
    private auth: AuthService,
    private plt: Platform,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    /* se traen los datos de las rondas */
    new Promise((resolve, reject) => {
      this.guard = this.auth.guardData()
      resolve()
    }).then(() => {
      this.shifts$ = this.api.getGuardShift(this.guard.id)
      this.api.getGuardShift(this.guard.id).toPromise()
        .then((data: any) => {
          this.shifts = data.shifts;
        })
    })

   /*  this.plt.ready().then(() => {
      this.localNotifications.on('click').subscribe(res => {
         console.log('click', res);
        let msg = res.data ? res.data.mysata : '';
        this.showAlert(res.title, res.text, msg);
      });
      this.localNotifications.on('trigger').subscribe(res => {
        console.log('trigger', res);
        let msg = res.data ? res.data.mysata : '';
        this.showAlert(res.title, res.text, msg);
      }); */

    /* }); */
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }
  async openModal(shift) {
    const modal = await this.modalController.create({
      component: RondasPage,
      componentProps: shift
    });
    return await modal.present();
  }

  /* se guardan los datos de id de ronda y id de cliente en la variable guard */
  saveId() {
    this.guard.shiftId = parseInt(this.shiftId.split('$')[0])
    this.guard.client = parseInt(this.shiftId.split('$')[1])
    
    sessionStorage.setItem('guard', JSON.stringify(this.guard))
  }

 

  openUrl() {
    this.browser.create('https://www.google.cl/maps/', '_self')
  }

  /* datos del local notification */
  async notification() {
    /* await this.localNotifications.schedule({
      id: 10,
      title: 'Recordatorio de ronda',
      text: 'Recuerde registrar si ha ocurrido algún incidente',
      data: { mysata: 'mensaje oculto de la notificacion' },
         trigger: { in: 60, unit: ELocalNotificationTriggerUnit.MINUTE },
      trigger: { in: 10, unit: ELocalNotificationTriggerUnit.SECOND },
      foreground: true,

    }) */
    this.router.navigate(['tabs/tab4'])
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  /* alerta para terminar la ronda y llamada al servicio de la api para terminar la ronda */
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: 'Desea finalizar la ronda',
      buttons: [{
        text: 'Okay',
        handler: () => {
          this.api.finalShift(this.guard.shiftId, this.guard.client, this.guard.id).toPromise()
      .then((data: any) => {
      }).catch(error => {
        this.presentToast('La ronda ya se encuentra finalizada.')
      })
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: cancel');
        }
      }]
    });

    await alert.present();
  }

   /* alerta para iniciar la ronda y llamada al servicio de la api para iniciar la ronda */
  async presentAlert2() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Alerta',
      message: 'Desea iniciar la ronda',
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.api.initShift(this.guard.shiftId, this.guard.client, this.guard.id).toPromise()
      .then((data: any) => {

      }).catch(error => {
        this.presentToast('La ronda ya se encuentra iniciada.')
      })
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: cancel');
        }
      }]
    });

    await alert.present();
  }

}



