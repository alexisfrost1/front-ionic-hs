import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup

  constructor(
    private auth: AuthService,
    public formBuilder: FormBuilder,

  ) { }
/* instancia el formulario con la estructura de formulario de login */
  ngOnInit() {
    this.loginForm = this.createLoginForm()
  }

  /* usa los datos del login para llamar al servicio de login de la api */
  login() {
    this.auth.login(this.loginForm.value)
  }

  //formulario de login
  createLoginForm() {
    return this.formBuilder.group({
      rut: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

}
