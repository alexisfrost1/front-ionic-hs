import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Guard } from '../models/guard.interface';
import { Incident } from '../models/incident.interface';
import { Shift } from '../models/shift.interface';
import { Visitor } from '../models/visitor.interface';
import { Report } from '../models/report.interface';
import { initShift } from '../models/initShift.interface';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //url de la api del backend donde se realizan las consultas post, get y put

   //private apiUrl = 'http://localhost:3000/api'
   private apiUrl = 'http://server.highsecurity.cl/api'
  constructor(
    private http: HttpClient
  ) {

  }
  //llamada al servicio para autenticar al usuario guardia
  login(rut: string, password: string): Observable<Guard> {
    return this.http.post<Guard>(this.apiUrl + '/auth/loginApp', { rut, password });
  }

  //llamada al servicio para obtener los datos del guardia
  getGuardById(): Observable<Guard[]> {
    return this.http.get<Guard[]>(this.apiUrl + '/users/Guards');
  }

  //llamada al servicio para registrar una novedad
  register(data: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl + '/news', data);
  }

  //llamada al servicio para obtener las rondas asignadas al guardia
  getGuardShift(id: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl + '/shifts/guardShifts/' + id);
  }

  //llamada al servicio para guardar la visita
  registerVisitor(data: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(this.apiUrl + '/visits', data);
  }

  //llamada al servicio para obtener las visitas registradas
  getVisitors(id: number): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.apiUrl + '/visits/allVisit/' + id);
  }

 //llamada al servicio para iniciar el turno del guardia
  initShift(id: number, idClient: number, idGuard: number): Observable<initShift> {
    return this.http.put<initShift>(this.apiUrl + '/shifts/init/' + id + '/' + idClient, {idGuard});
  }

  //llamada al servicio para terminar el turno del guardia
  finalShift(id: number, idClient: number, idGuard: number): Observable<initShift> {
    return this.http.put<initShift>(this.apiUrl + '/shifts/final/' + id + '/' + idClient, {idGuard});
  }
 
  //llamada al servicio para registrar un reporte de emergencia
  report(dataReport: Report): Observable<Report> {
    return this.http.post<Report>(this.apiUrl + '/reports', dataReport);

  }

  //llamada al servicio para guardar la hora de salida de la visita
  outVisit(shiftId: number, visitId:number, out:string): Observable<Guard> {
    return this.http.put<Guard>(this.apiUrl + '/visits/out/', {shiftId,visitId, out});
  }
}