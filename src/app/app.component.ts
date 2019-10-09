import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  name = "Angular";
  token = "";

  appId = "NKx8jcTZApNzbVLlQxQaqtURlrmEONPYSRMeGrgT";
  jsKey = "kwFKcBrH3bUxeVNxumZkcdNZElTSr3AgGOMepNPR";
  restKey = "Vz4ylU99c6XYo3mQahs4G2IxOEzGalArPMTgR4eF";
  serverUrl = "https://pg-app-123bbiela0etpqsfe5qgpdepldlcyv.scalabl.cloud/1/";

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  loginFlow() {
    console.log("no timeout");
    return this._login("deleteme@fake.mail", "123")
      .then(token => {
        console.log("token", token);
        this.token = token;
        return this._checkToken();
      })
      .then(valid => {
        console.log("valid", valid);
        return this._logout();
      })
      .then(
        r => {
          console.log("logged out");
        },
        err => {
          console.error(err);
        }
      );
  }

  loginFlowWithTimeout() {
    console.log("timeout");
  }

  private _login(username, password) {
    return this.http
      .post(
        this.serverUrl + "functions/login",
        { username, password },
        {
          headers: {
            "X-Parse-Application-Id": this.appId,
            "X-Parse-REST-API-Key": this.restKey
          }
        }
      )
      .toPromise<any>()
      .then(r => r.result.sessionToken);
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
