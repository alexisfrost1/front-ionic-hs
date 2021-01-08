import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Visitor } from 'src/app/models/visitor.interface';
import { Observable } from 'rxjs';
import { Shift } from 'src/app/models/shift.interface';
import { Guard } from 'src/app/models/guard.interface';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-out',
  templateUrl: './out.page.html',
  styleUrls: ['./out.page.scss'],
})
export class OutPage implements OnInit {
  visitas: Visitor[]
  visitas$: Observable<Visitor[]>
  shifts: Shift[]
  shifts$: Observable<Shift[]>
  guard: Guard
  variableOut
  constructor(
    private modalController: ModalController,
    private api: ApiService,
    private auth: AuthService,
    public toastController: ToastController,
  ) { 
    /* se traen los datos de las rondas del guardia y de las visitas */
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
    this.visitas$ = this.api.getVisitors(this.guard.shiftId)
    this.api.getVisitors(this.guard.shiftId).toPromise()
      .then((data: any) => {
        this.visitas = data.visits;
       /*  console.table(data.visits) */
        
      })
  }

  ngOnInit(  ) {
  }
  async closeModal() {
    await this.modalController.dismiss();
  }


  outVisit(){
    /* se trae la variable de hora en formato militar que se registra y se corta para dejar la hora en el formato deseado */
    var corteFecha = this.variableOut.split('T')[1]
    var corteExtra = corteFecha.split('.')[0]
    
    var hora = corteExtra.split(':')[0]
    var minuto = corteExtra.split(':')[1]
    var horaMinuto = hora+ ':' + minuto
   
    //se envia la variable hora de salida a la api
    this.api.outVisit(this.guard.shiftId, this.guard.visitId, horaMinuto).toPromise()
    .then((data: any) => {
    }).catch(error => {
      this.presentToast('Error al guardar hora de salida de visitante')
    })
  }

  //configuracion del toast para mensages de error
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      duration: 2000
    });
    toast.present();
  }
}
