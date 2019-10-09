import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Sashido";
  token = "";

  appId = "NKx8jcTZApNzbVLlQxQaqtURlrmEONPYSRMeGrgT";
  jsKey = "kwFKcBrH3bUxeVNxumZkcdNZElTSr3AgGOMepNPR";
  restKey = "Vz4ylU99c6XYo3mQahs4G2IxOEzGalArPMTgR4eF";
  serverUrl = "https://pg-app-123bbiela0etpqsfe5qgpdepldlcyv.scalabl.cloud/1/";

  pending = false;
  error = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  loginFlow() {
    this.pending = true;
    return this._login("deleteme@fake.mail", "123")
      .then(() => this._checkToken())
      .then(valid => this._logout())
      .then(
        r => {
          this.pending = false;
          this.error = null;
        },
        err => {
          this.pending = false;
          this.error = err;
        }
      );
  }

  loginFlowWithTimeout() {
    this.pending = true;
    return this._login("deleteme@fake.mail", "123")
      .then(() => new Promise(resolve => setTimeout(resolve, 2000)))
      .then(() => this._checkToken())
      .then(valid => this._logout())
      .then(
        r => {
          this.pending = false;
          this.error = null;
        },
        err => {
          this.pending = false;
          this.error = err;
        }
      );
  }

  private _login(username, password) {
    return this.http
      .get(this.serverUrl + "/login", {
        params: {
          username,
          password
        },
        headers: {
          "X-Parse-Application-Id": this.appId,
          "X-Parse-REST-API-Key": this.restKey
        }
      })
      .toPromise<any>()
      .then(r => (this.token = r.sessionToken));
  }

  private _checkToken() {
    return this.http
      .post(
        this.serverUrl + "functions/validToken",
        {},
        {
          headers: {
            "X-Parse-Application-Id": this.appId,
            "X-Parse-REST-API-Key": this.restKey,
            "X-Parse-Session-Token": this.token
          }
        }
      )
      .toPromise<any>();
  }

  private _logout() {
    // return Parse.User.logOut();
    return this.http
      .post(
        this.serverUrl + "logout",
        {},
        {
          headers: {
            "X-Parse-Application-Id": this.appId,
            "X-Parse-REST-API-Key": this.restKey,
            "X-Parse-Session-Token": this.token
          }
        }
      )
      .toPromise<any>();
  }
}
